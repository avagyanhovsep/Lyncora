import type { IMessage, IUser } from "../../../../types";
import MoreIcon from "../../../../utils/icons/more-icon";

type Props = {
    message: IMessage;
    mine: boolean;
    showAvatar: boolean;
    partner: IUser;
    isDeletedPartner: boolean;
    bubbleClass: string;
    stackSpacing: string;
    status?: string;
    onOpenMessageActions?: (messageId: number) => void;
};

export default function MessageRow({
    message,
    mine,
    showAvatar,
    partner,
    isDeletedPartner,
    bubbleClass,
    stackSpacing,
    status,
    onOpenMessageActions,
}: Props) {
    return (
        <div
            className={`flex w-full ${
                mine ? "justify-end" : "justify-start"
            } ${stackSpacing}`}
        >
            <div
                className={`flex max-w-[80%] items-end gap-2 sm:max-w-[70%] ${
                    mine ? "flex-row-reverse" : "flex-row"
                }`}
            >
                {!mine ? (
                    <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full">
                        {showAvatar ? (
                            !isDeletedPartner && partner.avatarURL ? (
                                <img
                                    src={partner.avatarURL}
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
                        mine ? "items-end" : "items-start"
                    }`}
                >
                    <div className="flex items-center gap-1 group">
                        {mine && onOpenMessageActions ? (
                            <button
                                type="button"
                                onClick={() => onOpenMessageActions(message.id)}
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
}
