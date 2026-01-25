import { NavLink } from "react-router-dom";

type Props = {
    username: string;
    postsCount: number;
    followersCount: number;
    followingsCount: number;
    linkFollowers?: boolean;
    linkFollowings?: boolean;
};

const Chip = ({ children, to }: { children: React.ReactNode; to?: string }) => {
    const base =
        "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm " +
        "bg-slate-50/90 ring-1 ring-slate-200/70 shadow-sm shadow-black/5 " +
        "dark:bg-black/20 dark:ring-white/10 dark:text-gray-200 " +
        "backdrop-blur active:scale-95 transition";

    if (!to) return <div className={base}>{children}</div>;

    return (
        <NavLink
            to={to}
            className={`${base} md:hover:bg-slate-100 md:dark:hover:bg-white/[0.06]`}
        >
            {children}
        </NavLink>
    );
};

export default function ProfileStats({
    username,
    postsCount,
    followersCount,
    followingsCount,
    linkFollowers = true,
    linkFollowings = true,
}: Props) {
    return (
        <div className="w-full flex flex-wrap gap-3">
            <Chip>
                <span className="text-slate-900 font-semibold dark:text-white">
                    {postsCount}
                </span>
                posts
            </Chip>

            <Chip
                to={
                    linkFollowers ? `/profile/${username}/followers` : undefined
                }
            >
                <span className="text-slate-900 font-semibold dark:text-white">
                    {followersCount}
                </span>
                followers
            </Chip>

            <Chip
                to={
                    linkFollowings
                        ? `/profile/${username}/followings`
                        : undefined
                }
            >
                <span className="text-slate-900 font-semibold dark:text-white">
                    {followingsCount}
                </span>
                followings
            </Chip>
        </div>
    );
}
    