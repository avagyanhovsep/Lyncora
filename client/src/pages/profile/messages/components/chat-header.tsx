import { Link } from "react-router-dom";
import type { IUser } from "../../../../types";
import Image from "../../components/image";
import MoreIcon from "../../../../utils/icons/more-icon";

type Props = {
    partner: IUser;
    isDeletedPartner: boolean;
    displayName: string;
    handle: string;
    onBackMobile?: () => void;
    onOpenConversationDelete: () => void;
};

export default function ChatHeader({
    partner,
    isDeletedPartner,
    displayName,
    handle,
    onBackMobile,
    onOpenConversationDelete,
}: Props) {
    return (
        <div className="sticky top-0 z-10 w-full border-b border-slate-200/70 bg-white/80 px-2 py-3 backdrop-blur-md dark:border-white/10 dark:bg-[#0b1013]/70 md:px-5">
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onBackMobile}
                    className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-100 active:scale-95 transition dark:hover:bg-white/10"
                    aria-label="Back"
                >
                    ←
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
                            onClick={onOpenConversationDelete}
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
                                        {displayName}
                                    </div>
                                    <div className="truncate text-xs text-slate-500 dark:text-slate-400">
                                        {handle}
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <button
                            type="button"
                            onClick={onOpenConversationDelete}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-100 active:scale-95 transition dark:hover:bg-white/10"
                            aria-label="More"
                            title="Conversation options"
                        >
                            <MoreIcon className="fill-slate-900 dark:fill-white" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
