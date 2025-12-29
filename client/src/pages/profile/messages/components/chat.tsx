import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import NiceModal from "@ebay/nice-modal-react";
import { isAxiosError } from "axios";

import type { IContext, IMessage, IUser } from "../../../../types";
import { useSocket } from "../../../../socket/socket-provider";
import { Axios } from "../../../../api";

import Image from "../../components/image";
import PlaneIcon from "../../../../utils/icons/plane-icon";
import MoreIcon from "../../../../utils/icons/more-icon";
import DeleteConversationModal from "./delete-chat-modal";
import MessageActionsModal from "./delete-mesaage-modal";
import ArrowDownIcon from "../../../../utils/icons/arrow-down-icon";

type IUserWithDeletedAt = IUser & { deletedAt?: string | null };

type OverlayProps = {
    onClose: () => void;
    children: React.ReactNode;
};

const Overlay = ({ onClose, children }: OverlayProps) => {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
            <button
                type="button"
                className="absolute inset-0 bg-black/60"
                onClick={onClose}
                aria-label="Close"
            />
            {children}
        </div>
    );
};

export default function Chat({
    chatId,
    partner,
    onNewMessage,
    partnerLastReadAt,
    onBackMobile,
    onDeleteConversation,
}: {
    chatId: number;
    partner: IUser | undefined;
    onNewMessage?: (chatId: number, message: IMessage) => void;
    partnerLastReadAt?: string;
    onBackMobile?: () => void;
    onDeleteConversation?: (chatId: number) => void;
}) {
    const { account } = useOutletContext<IContext>();
    const socket = useSocket();

    const [messages, setMessages] = useState<IMessage[]>([]);
    const [text, setText] = useState("");
    const [sendError, setSendError] = useState("");

    const listRef = useRef<HTMLDivElement | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const autoScrollRef = useRef(true);

    const isDeletedPartner = useMemo(() => {
        if (!partner) return false;
        const p = partner as IUserWithDeletedAt;
        return Boolean(p.deletedAt) || p.id === -1;
    }, [partner]);

    const partnerDisplayName = useMemo(() => {
        if (!partner) return "";
        if (isDeletedPartner) return "Deleted User";

        const first = partner.firstName ?? "";
        const last = partner.lastName ?? "";
        const full = `${first} ${last}`.trim();
        return full || partner.username;
    }, [partner, isDeletedPartner]);

    const partnerHandle = useMemo(() => {
        if (!partner) return "";
        return isDeletedPartner ? "@deleted" : `@${partner.username}`;
    }, [partner, isDeletedPartner]);

    const scrollToBottom = useCallback((behavior: ScrollBehavior) => {
        const el = bottomRef.current;
        if (el) el.scrollIntoView({ behavior, block: "end" });
    }, []);

    const addMessage = useCallback(
        (message: IMessage) => {
            setMessages((prev) => {
                for (let i = 0; i < prev.length; i++) {
                    if (prev[i].id === message.id) return prev;
                }
                return [...prev, message];
            });

            if (onNewMessage) onNewMessage(chatId, message);
        },
        [chatId, onNewMessage]
    );

    useEffect(() => {
        const el = listRef.current;
        if (!el) return;

        const onScroll = () => {
            const dist = el.scrollHeight - (el.scrollTop + el.clientHeight);
            autoScrollRef.current = dist < 120;
        };

        el.addEventListener("scroll", onScroll);
        onScroll();

        return () => {
            el.removeEventListener("scroll", onScroll);
        };
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.emit("dm:join", { chatId });

        const onSocketMessage = (message: IMessage) => {
            if (message.chatId !== chatId) return;
            addMessage(message);
        };

        socket.on("dm:message:new", onSocketMessage);

        return () => {
            socket.emit("dm:leave", { chatId });
            socket.off("dm:message:new", onSocketMessage);
        };
    }, [socket, chatId, addMessage]);

    useEffect(() => {
        let alive = true;

        setSendError("");
        setText("");

        Axios.get(`/chats/${chatId}/messages`)
            .then((res) => {
                if (!alive) return;
                const list: IMessage[] = Array.isArray(res.data?.messages)
                    ? res.data.messages
                    : [];
                setMessages(list);
                requestAnimationFrame(() => scrollToBottom("auto"));
            })
            .catch(() => {});

        return () => {
            alive = false;
        };
    }, [chatId, scrollToBottom]);

    useEffect(() => {
        if (!autoScrollRef.current) return;
        requestAnimationFrame(() => scrollToBottom("smooth"));
    }, [messages, scrollToBottom]);

    const openConversationDelete = useCallback(async () => {
        const ok: boolean = await NiceModal.show(DeleteConversationModal, {
            chatId,
            Overlay,
        });
        if (!ok) return;

        if (onDeleteConversation) onDeleteConversation(chatId);
        if (onBackMobile) onBackMobile();
    }, [chatId, onDeleteConversation, onBackMobile]);

    const openMessageActions = useCallback(
        async (messageId: number) => {
            const ok: boolean = await NiceModal.show(MessageActionsModal, {
                chatId,
                messageId,
                Overlay,
            });
            if (!ok) return;

            setMessages((prev) => prev.filter((m) => m.id !== messageId));
        },
        [chatId]
    );

    const send = useCallback(async () => {
        const trimmed = text.trim();
        if (!trimmed) return;

        if (isDeletedPartner) {
            setSendError(
                "This user deleted their account. You can view messages, but you can’t send new ones."
            );
            return;
        }

        setSendError("");

        try {
            const res = await Axios.post(`/chats/${chatId}/messages`, {
                text: trimmed,
            });

            const newMessage = res.data?.message as IMessage | undefined;
            if (!newMessage) throw new Error("No message returned");

            addMessage(newMessage);
            setText("");
            requestAnimationFrame(() => scrollToBottom("smooth"));
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                const status = err.response?.status;
                const serverMessage =
                    typeof err.response?.data?.message === "string"
                        ? err.response.data.message
                        : "";

                if (status === 410) {
                    setSendError(
                        serverMessage ||
                            "This user deleted their account. You can’t send new messages."
                    );
                    return;
                }

                if (status === 403) {
                    setSendError(
                        serverMessage ||
                            "You are not allowed to send a message."
                    );
                    return;
                }
            }

            setSendError("Failed to send message. Please try again.");
        }
    }, [text, isDeletedPartner, chatId, addMessage, scrollToBottom]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        void send();
    };

    if (!partner) return null;

    return (
        <div className="flex h-full flex-col pb-20 text-slate-900 dark:text-white md:pb-0">
            <div className="sticky top-0 z-10 w-full border-b border-slate-200/70 bg-white/80 px-2 py-3 backdrop-blur-md dark:border-white/10 dark:bg-[#0b1013]/70 md:px-5">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onBackMobile}
                        className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-100 active:scale-95 transition dark:hover:bg-white/10"
                        aria-label="Back"
                    >
                        <ArrowDownIcon  className="rotate-90 w-5 h-5"/>
                    </button>

                    {isDeletedPartner ? (
                        <div className="flex flex-1 items-center justify-between gap-3 min-w-0">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-slate-200/70 dark:ring-white/10">
                                    <img
                                        src="/assets/default.jpeg"
                                        alt="avatar"
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                <div className="min-w-0">
                                    <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                                        Deleted User
                                    </div>
                                    <div className="truncate text-xs text-slate-500 dark:text-slate-400">
                                        Account deleted
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={openConversationDelete}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-100 active:scale-95 transition dark:hover:bg-white/10"
                                aria-label="More"
                                title="Conversation options"
                            >
                                <MoreIcon className="fill-slate-900 dark:fill-white" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex w-full items-center gap-3">
                            <Link
                                to={`/profile/${partner.username}`}
                                className="group flex-1 min-w-0"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-slate-200/70 dark:ring-white/10">
                                        {partner.avatar ? (
                                            <Image
                                                src={partner.avatar}
                                                alt="avatar"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <img
                                                src="/assets/default.jpeg"
                                                alt="avatar"
                                                className="h-full w-full object-cover"
                                            />
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                                            {partnerDisplayName}
                                        </div>
                                        <div className="truncate text-xs text-slate-500 dark:text-slate-400">
                                            {partnerHandle}
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            <button
                                type="button"
                                onClick={openConversationDelete}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-100 active:scale-95 transition dark:hover:bg-white/10"
                                aria-label="More"
                                title="Conversation options"
                            >
                                <MoreIcon className="fill-slate-900 dark:fill-white" />
                            </button>
                        </div>
                    )}
                </div>

                {isDeletedPartner ? (
                    <div className="mt-3 rounded-xl bg-slate-100 px-3 py-2 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10">
                        This user deleted their account. You can view message
                        history, but you can’t send new messages.
                    </div>
                ) : null}

                {sendError ? (
                    <div className="mt-2 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700 ring-1 ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/20">
                        {sendError}
                    </div>
                ) : null}
            </div>

            <div
                ref={listRef}
                className="flex-1 overflow-y-auto px-2 py-5 lg:px-5 custom-scrollbar"
            >
                {messages.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400">
                        <div className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                            No messages yet
                        </div>
                        <div className="mt-1 max-w-xs text-sm">
                            {isDeletedPartner
                                ? "This conversation is read-only."
                                : "Send a message to start the conversation."}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {messages.map((message, i) => {
                            const mine = message.userId === account.id;

                            const prev = i > 0 ? messages[i - 1] : undefined;
                            const next =
                                i + 1 < messages.length
                                    ? messages[i + 1]
                                    : undefined;

                            const sameAsPrev =
                                prev !== undefined &&
                                prev.userId === message.userId;
                            const sameAsNext =
                                next !== undefined &&
                                next.userId === message.userId;

                            const isLast = i === messages.length - 1;

                            const status =
                                mine && isLast
                                    ? partnerLastReadAt &&
                                      Date.parse(partnerLastReadAt) >=
                                          Date.parse(message.createdAt)
                                        ? "Seen"
                                        : "Delivered"
                                    : "";

                            const leftRadius = !mine
                                ? `${
                                      sameAsPrev
                                          ? "rounded-tl-sm"
                                          : "rounded-tl-xl"
                                  } ${
                                      sameAsNext
                                          ? "rounded-bl-sm"
                                          : "rounded-bl-xl"
                                  }`
                                : "";

                            const rightRadius = mine
                                ? `${
                                      sameAsPrev
                                          ? "rounded-tr-sm"
                                          : "rounded-tr-xl"
                                  } ${
                                      sameAsNext
                                          ? "rounded-br-sm"
                                          : "rounded-br-xl"
                                  }`
                                : "";

                            const showAvatar = !mine && !sameAsNext;

                            const bubbleClass = mine
                                ? `bg-indigo-700 text-white ${rightRadius}`
                                : `bg-slate-100 text-slate-900 ${leftRadius} dark:bg-neutral-800 dark:text-slate-100`;

                            const stackSpacing = `${
                                sameAsPrev ? "mt-1" : "mt-3"
                            }`;

                            return (
                                <div
                                    key={message.id}
                                    className={`flex w-full ${
                                        mine ? "justify-end" : "justify-start"
                                    } ${stackSpacing}`}
                                >
                                    <div
                                        className={`flex max-w-[80%] items-end gap-2 sm:max-w-[70%] ${
                                            mine
                                                ? "flex-row-reverse"
                                                : "flex-row"
                                        }`}
                                    >
                                        {!mine ? (
                                            <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full">
                                                {showAvatar ? (
                                                    !isDeletedPartner &&
                                                    partner.avatar ? (
                                                        <Image
                                                            src={partner.avatar}
                                                            alt="avatar"
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <img
                                                            src="/assets/default.jpeg"
                                                            alt="avatar"
                                                            className="h-full w-full object-cover"
                                                        />
                                                    )
                                                ) : null}
                                            </div>
                                        ) : null}

                                        <div
                                            className={`flex flex-col ${
                                                mine
                                                    ? "items-end"
                                                    : "items-start"
                                            }`}
                                        >
                                            <div className="flex items-center gap-1 group">
                                                {mine ? (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openMessageActions(
                                                                message.id
                                                            )
                                                        }
                                                        className="transition inline-flex items-center justify-center"
                                                        aria-label="Message options"
                                                        title="Options"
                                                    >
                                                        <MoreIcon className="w-5 h-5 fill-slate-900 dark:fill-white duration-200 opacity-0 group-hover:opacity-100" />
                                                    </button>
                                                ) : null}

                                                <div
                                                    className={`group px-3 py-1 text-sm leading-relaxed break-words rounded-xl ${bubbleClass}`}
                                                >
                                                    {message.text}
                                                </div>
                                            </div>

                                            {status ? (
                                                <div className="mt-1 text-[13px] text-slate-500">
                                                    {status}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        <div ref={bottomRef} />
                    </div>
                )}
            </div>

            <div className="px-4 py-3">
                <form
                    onSubmit={onSubmit}
                    className="flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/80 px-3 py-1 backdrop-blur dark:border-white/10 dark:bg-transparent"
                >
                    <input
                        disabled={isDeletedPartner}
                        className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:text-slate-50 dark:placeholder:text-slate-500"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={
                            isDeletedPartner
                                ? "You can’t message a deleted user."
                                : "Message…"
                        }
                    />

                    <button
                        type="submit"
                        disabled={isDeletedPartner || !text.trim()}
                        className="h-8 w-14 rounded-full bg-indigo-700 transition hover:brightness-110 disabled:bg-slate-200/70 disabled:text-slate-400 dark:disabled:bg-white/10 dark:disabled:text-white/40"
                        title={
                            isDeletedPartner
                                ? "This conversation is read-only"
                                : "Send"
                        }
                    >
                        <span className="flex h-full w-full items-center justify-center">
                            <PlaneIcon className="h-4 w-4 text-white" />
                        </span>
                    </button>
                </form>
            </div>
        </div>
    );
}
