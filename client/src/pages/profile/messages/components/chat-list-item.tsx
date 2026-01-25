import type { IUser } from "../../../../types";

type Props = {
    isActive: boolean;
    username: string;
    preview: string;
    previewClass: string;
    partner: IUser | null | undefined;
    isDeleted: boolean;
    onClick: () => void;
};

export default function ChatListItem({
    isActive,
    username,
    preview,
    previewClass,
    partner,
    isDeleted,
    onClick,
}: Props) {
    return (
        <button
            onClick={onClick}
            className={`
                w-full flex items-center gap-3 py-5 lg:py-3 px-0 md:px-2 transition text-left
                hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg
                ${
                    isActive
                        ? "bg-slate-100 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10"
                        : ""
                }
            `}
        >
            <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-white/10 ring-1 ring-slate-200/70 dark:ring-white/10 overflow-hidden shrink-0">
                {!isDeleted && partner?.avatarURL ? (
                    <img
                        src={partner.avatarURL}
                        alt="avatar"
                        className="w-full h-full rounded-full object-cover"
                    />
                ) : (
                    <img
                        src="/assets/default.jpeg"
                        alt="avatar"
                        className="w-full h-full rounded-full object-cover"
                    />
                )}
            </div>

            <div className="min-w-0 flex-1 flex-col flex md:hidden lg:flex">
                <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {username}
                </div>
                <div className={`text-xs truncate ${previewClass}`}>
                    {preview}
                </div>
            </div>
        </button>
    );
}
