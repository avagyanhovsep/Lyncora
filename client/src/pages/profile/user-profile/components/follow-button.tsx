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
    return (
        <button
            onClick={handleFollow}
            className={`px-6 py-1 text-sm group relative inline-flex items-center justify-center gap-2 rounded-md duration-300 active:scale-90
                ${
                    requested
                        ? "bg-slate-300 text-slate-800 dark:bg-gray-400 dark:text-black"
                        : "bg-indigo-600 text-white hover:bg-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-600"
                }
            `}
        >
            <span className="relative">
                {requested
                    ? "Requested"
                    : amIFollowing
                    ? "Following"
                    : "Follow"}
            </span>
        </button>
    );
};

export default FollowButton;
