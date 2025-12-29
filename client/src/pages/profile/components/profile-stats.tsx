import { NavLink } from "react-router-dom";

type Props = {
    username: string;
    postsCount: number;
    followersCount: number;
    followingsCount: number;
    linkFollowers?: boolean;
    linkFollowings?: boolean;
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
            <div className="rounded-xl bg-slate-50 ring-1 ring-slate-200/70 px-4 py-2 text-sm text-slate-700 dark:bg-black/20 dark:ring-white/10 dark:text-gray-200">
                <span className="text-slate-900 font-semibold dark:text-white">
                    {postsCount}
                </span>{" "}
                posts
            </div>

            {linkFollowers ? (
                <NavLink
                    to={`/profile/${username}/followers`}
                    className="rounded-xl bg-slate-50 ring-1 ring-slate-200/70 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition dark:bg-black/20 dark:ring-white/10 dark:text-gray-200 dark:hover:bg-white/[0.06] dark:hover:ring-white/20"
                >
                    <span className="text-slate-900 font-semibold dark:text-white">
                        {followersCount}
                    </span>{" "}
                    followers
                </NavLink>
            ) : (
                <div className="rounded-xl bg-slate-50 ring-1 ring-slate-200/70 px-4 py-2 text-sm text-slate-700 dark:bg-black/20 dark:ring-white/10 dark:text-gray-200">
                    <span className="text-slate-900 font-semibold dark:text-white">
                        {followersCount}
                    </span>{" "}
                    followers
                </div>
            )}

            {linkFollowings ? (
                <NavLink
                    to={`/profile/${username}/followings`}
                    className="rounded-xl bg-slate-50 ring-1 ring-slate-200/70 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition dark:bg-black/20 dark:ring-white/10 dark:text-gray-200 dark:hover:bg-white/[0.06] dark:hover:ring-white/20"
                >
                    <span className="text-slate-900 font-semibold dark:text-white">
                        {followingsCount}
                    </span>{" "}
                    followings
                </NavLink>
            ) : (
                <div className="rounded-xl bg-slate-50 ring-1 ring-slate-200/70 px-4 py-2 text-sm text-slate-700 dark:bg-black/20 dark:ring-white/10 dark:text-gray-200">
                    <span className="text-slate-900 font-semibold dark:text-white">
                        {followingsCount}
                    </span>{" "}
                    followings
                </div>
            )}
        </div>
    );
}
