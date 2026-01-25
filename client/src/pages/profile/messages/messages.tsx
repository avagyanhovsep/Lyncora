import { useLocation, useOutletContext } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Axios } from "../../../api";
import type { IChat, IContext, IMessage, IUser } from "../../../types";
import Chat from "./components/chat";
import InboxShell from "./components/inbox-shell";
import { InboxEmpty, SelectChatHint } from "./components/inbox-empty";
import InboxToolbar from "./components/inbox-toolbar";
import ChatListItem from "./components/chat-list-item";

type InboxState = {
    activeChatId?: number;
    chat?: IChat;
} | null;

const isDeletedUser = (u: IUser | null | undefined) => {
    if (!u) return true;
    const maybe = u as unknown as { deletedAt?: string | null };
    return Boolean(maybe.deletedAt) || u.id === -1;
};

const displayUsername = (u: IUser | null | undefined) =>
    isDeletedUser(u) ? "Deleted User" : u!.username;

const displayFirstName = (u: IUser | null | undefined) => {
    if (isDeletedUser(u)) return "Deleted User";
    const first = (u!.firstName ?? "").trim();
    return first ? u!.firstName : u!.username;
};

const Messages = () => {
    const { account } = useOutletContext<IContext>();
    const location = useLocation();

    const [chats, setChats] = useState<IChat[]>([]);
    const [activeChatId, setActiveChatId] = useState<number | null>(null);

    const markLocal = useCallback(
        (chatId: number) => {
            const now = new Date().toISOString();

            setChats((prev) =>
                prev.map((chat) => {
                    if (chat.id !== chatId) return chat;

                    const members = chat.members.map((member) =>
                        member.userId === account.id
                            ? { ...member, lastReadAt: now }
                            : member,
                    );

                    return { ...chat, members };
                }),
            );
        },
        [account.id],
    );

    useEffect(() => {
        if (activeChatId === null) return;

        Axios.post(`/chats/${activeChatId}/read`)
            .then(() => markLocal(activeChatId))
            .catch(() => {});
    }, [activeChatId, markLocal]);

    useEffect(() => {
        const state = (location.state as InboxState) ?? null;

        const incomingActiveChatId =
            state && typeof state.activeChatId === "number"
                ? state.activeChatId
                : null;

        const incomingChat = state && state.chat ? state.chat : null;

        Axios.get<{ chats: IChat[] }>("/chats").then((response) => {
            let list = response.data.chats;

            if (incomingChat && !list.some((c) => c.id === incomingChat.id)) {
                list = [incomingChat, ...list];
            }

            setChats(list);
            setActiveChatId(incomingActiveChatId);

            if (incomingActiveChatId !== null || incomingChat) {
                window.history.replaceState({}, document.title);
            }
        });
    }, [location.state]);

    const onNewMessage = useCallback(
        (chatId: number, message: IMessage) => {
            const now = new Date().toISOString();

            setChats((prev) => {
                const index = prev.findIndex((c) => c.id === chatId);
                if (index === -1) return prev;

                const chat = prev[index];

                const members =
                    chatId === activeChatId
                        ? chat.members.map((member) =>
                              member.userId === account.id
                                  ? { ...member, lastReadAt: now }
                                  : member,
                          )
                        : chat.members;

                const updatedChat: IChat = {
                    ...chat,
                    messages: [message],
                    members,
                };

                const next = prev.slice();
                next.splice(index, 1);
                next.unshift(updatedChat);
                return next;
            });
        },
        [account.id, activeChatId],
    );

    const activeChat = useMemo(() => {
        if (activeChatId === null) return null;
        return chats.find((c) => c.id === activeChatId) ?? null;
    }, [activeChatId, chats]);

    const activePartnerMember = useMemo(() => {
        if (!activeChat) return null;
        return activeChat.members.find((m) => m.userId !== account.id) ?? null;
    }, [activeChat, account.id]);

    const activePartner = useMemo(() => {
        if (!activePartnerMember) return null;
        return (activePartnerMember.user ?? null) as unknown as IUser | null;
    }, [activePartnerMember]);

    const partnerLastReadAt = activePartnerMember?.lastReadAt ?? undefined;

    const showChat =
        activeChatId !== null &&
        activeChat !== null &&
        activePartnerMember !== null;

    const partnerForChat = activePartner ? activePartner : undefined;

    return (
        <InboxShell
            showChat={showChat}
            sidebar={
                <div className="w-full px-4 sm:px-6 py-10">

                    <div className="mb-6 flex items-end justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                                Messages
                            </h1>
                            <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">
                                Your inbox conversations.
                            </p>
                        </div>

                        <span className="rounded-full bg-slate-100 ring-1 ring-slate-200/70 px-3 py-1 text-sm text-slate-700 dark:bg-white/10 dark:ring-white/10 dark:text-gray-200">
                            {chats.length} chat{chats.length === 1 ? "" : "s"}
                        </span>
                    </div>

                    <div className="py-0 lg:py-4 flex flex-col">
                        {chats.length === 0 ? (
                            <InboxEmpty />
                        ) : (
                            <div>
                                <InboxToolbar />

                                {chats.map((chat) => {
                                    const partnerMember = chat.members.find(
                                        (member) =>
                                            member.userId !== account.id,
                                    );
                                    if (!partnerMember) return null;

                                    const partner = (partnerMember.user ??
                                        null) as unknown as IUser | null;

                                    const myMember = chat.members.find(
                                        (member) =>
                                            member.userId === account.id,
                                    );
                                    const isActive = chat.id === activeChatId;

                                    const last =
                                        chat.messages &&
                                        chat.messages.length > 0
                                            ? chat.messages[0]
                                            : null;

                                    const preview = last
                                        ? last.userId === account.id
                                            ? "You sent a message"
                                            : `${displayFirstName(partner)} sent you a message`
                                        : "No messages yet.";

                                    const readMark = myMember?.lastReadAt
                                        ? Date.parse(myMember.lastReadAt)
                                        : 0;
                                    const messageMark = last?.createdAt
                                        ? Date.parse(last.createdAt)
                                        : 0;

                                    const unread =
                                        last !== null &&
                                        last.userId !== account.id &&
                                        messageMark > readMark;

                                    const previewClass = isActive
                                        ? "text-slate-500 dark:text-white/70"
                                        : unread
                                          ? "text-slate-900 dark:text-slate-100 font-semibold"
                                          : "text-slate-600 dark:text-slate-400";

                                    return (
                                        <ChatListItem
                                            key={chat.id}
                                            isActive={isActive}
                                            username={displayUsername(partner)}
                                            preview={preview}
                                            previewClass={previewClass}
                                            partner={partner}
                                            isDeleted={isDeletedUser(partner)}
                                            onClick={() =>
                                                setActiveChatId(chat.id)
                                            }
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            }
            main={
                showChat ? (
                    <Chat
                        chatId={activeChatId as number}
                        partner={partnerForChat}
                        partnerLastReadAt={partnerLastReadAt}
                        onNewMessage={onNewMessage}
                        onBackMobile={() => setActiveChatId(null)}
                        onDeleteConversation={(id) => {
                            setChats((prev) => prev.filter((c) => c.id !== id));
                            setActiveChatId(null);
                        }}
                    />
                ) : (
                    <SelectChatHint />
                )
            }
        />
    );
};

export default Messages;
