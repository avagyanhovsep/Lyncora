import type { IRawFollowing } from "../../../../types.ts";

const FollowButton = ({
    handleFollow,
    requested,
    amIFollowing,
}: {
    handleFollow?: () => void;
    requested?: IRawFollowing;
    amIFollowing?: IRawFollowing;
}) => {
    const label = requested
        ? "Requested"
        : amIFollowing
          ? "Following"
          : "Follow";

    const base =
        "inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium " +
        "shadow-sm shadow-black/5 active:scale-95 transition select-none";

    const requestedCls =
        "bg-slate-200/80 text-slate-800 ring-1 ring-slate-300/70 " +
        "dark:bg-white/10 dark:text-gray-100 dark:ring-white/10";

    const followingCls =
        "bg-slate-100/80 text-slate-900 ring-1 ring-slate-200/70 " +
        "dark:bg-white/10 dark:text-gray-100 dark:ring-white/10 " +
        "md:hover:bg-slate-200/60 md:dark:hover:bg-white/[0.14]";

    const followCls =
        "bg-indigo-600 text-white ring-1 ring-indigo-500/30 shadow-lg shadow-indigo-600/20 " +
        "md:hover:bg-indigo-500";

    return (
        <button
            onClick={handleFollow}
            type="button"
            className={[
                base,
                requested
                    ? requestedCls
                    : amIFollowing
                      ? followingCls
                      : followCls,
            ].join(" ")}
        >
            {label}
        </button>
    );
};

export default FollowButton;
