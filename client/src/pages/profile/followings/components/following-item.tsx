type FollowingItemUser = {
    id: number;
    username: string;
    firstName?: string | null;
    lastName?: string | null;
    avatarURL?: string | null;
};

type FollowingItemProps = {
    user: FollowingItemUser;
    onClick: (username: string) => void;
    rightText?: string;
};

export const FollowingItem = ({
    user,
    onClick,
    rightText = "View profile",
}: FollowingItemProps) => {
    return (
        <li
            onClick={() => onClick(user.username)}
            className={`flex items-center justify-between gap-4 rounded-xl bg-slate-50 p-4 hover:bg-slate-100 cursor-pointer transition active:scale-[0.99]
                dark:bg-black/20 dark:hover:bg-white/[0.03] dark:hover:ring-white/20`}
        >
            <div className="flex items-center gap-4 min-w-0">
                {user.avatarURL ? (
                    <img
                        src={user.avatarURL}
                        alt="avatar"
                        className="h-12 w-12 rounded-full object-cover ring-1 ring-slate-200/70 dark:ring-white/10"
                    />
                ) : (
                    <img
                        src="/assets/default.jpeg"
                        alt="avatar"
                        className="h-12 w-12 rounded-full object-cover ring-1 ring-slate-200/70 dark:ring-white/10"
                    />
                )}

                <div className="min-w-0">
                    <p className="font-medium text-slate-900 truncate dark:text-white">
                        {user.username}
                    </p>

                    <p className="text-sm text-slate-600 truncate dark:text-gray-400">
                        {(user.firstName ?? "").trim() ||
                        (user.lastName ?? "").trim()
                            ? `${user.firstName ?? ""} ${
                                  user.lastName ?? ""
                              }`.trim()
                            : "@user"}
                    </p>
                </div>
            </div>

            <span className="hidden sm:inline text-xs text-slate-500 dark:text-gray-500">
                {rightText}
            </span>
        </li>
    );
};
