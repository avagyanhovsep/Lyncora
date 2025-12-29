import type { IMessage, IUser } from "../../../../types";
import ChatEmpty from "./chat-empty";
import MessageRow from "./message-row";

type Props = {
    listRef: React.RefObject<HTMLDivElement | null>;
    bottomRef: React.RefObject<HTMLDivElement | null>;
    messages: IMessage[];
    accountId: number;
    partner: IUser;
    isDeletedPartner: boolean;
    partnerLastReadAt?: string;
    onOpenMessageActions: (messageId: number) => void;
};

export default function ChatList({
    listRef,
    bottomRef,
    messages,
    accountId,
    partner,
    isDeletedPartner,
    partnerLastReadAt,
    onOpenMessageActions,
}: Props) {
    return (
        <div
            ref={listRef}
            className="flex-1 overflow-y-auto px-2 py-5 lg:px-5 custom-scrollbar"
        >
            {messages.length === 0 ? (
                <ChatEmpty isDeletedPartner={isDeletedPartner} />
            ) : (
                <div className="space-y-1">
                    {messages.map((message, i) => {
                        const mine = message.userId === accountId;

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
                                  sameAsPrev ? "rounded-tl-sm" : "rounded-tl-xl"
                              } ${
                                  sameAsNext ? "rounded-bl-sm" : "rounded-bl-xl"
                              }`
                            : "";

                        const rightRadius = mine
                            ? `${
                                  sameAsPrev ? "rounded-tr-sm" : "rounded-tr-xl"
                              } ${
                                  sameAsNext ? "rounded-br-sm" : "rounded-br-xl"
                              }`
                            : "";

                        const showAvatar = !mine && !sameAsNext;

                        const bubbleClass = mine
                            ? `bg-indigo-700 text-white ${rightRadius}`
                            : `bg-slate-100 text-slate-900 ${leftRadius} dark:bg-neutral-800 dark:text-slate-100`;

                        const stackSpacing = `${sameAsPrev ? "mt-1" : "mt-3"}`;

                        return (
                            <MessageRow
                                key={message.id}
                                message={message}
                                mine={mine}
                                showAvatar={showAvatar}
                                partner={partner}
                                isDeletedPartner={isDeletedPartner}
                                bubbleClass={bubbleClass}
                                stackSpacing={stackSpacing}
                                status={status || undefined}
                                onOpenMessageActions={
                                    mine ? onOpenMessageActions : undefined
                                }
                            />
                        );
                    })}

                    <div ref={bottomRef} />
                </div>
            )}
        </div>
    );
}
