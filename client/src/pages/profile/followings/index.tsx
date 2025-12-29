import type { IAccount } from "../../../types.ts";
import { useHttpGet } from "../../../utils/hooks/useHttp.ts";
import { useNavigate, useParams } from "react-router-dom";
import { FollowingItem } from "./components/following-item.tsx";

const Followings = () => {
    const { username } = useParams();
    const {
        data,
        isLoading: accountIsLoading,
        error: accountError,
    } = useHttpGet<{ user: IAccount }>(`/account/${username}`);
    const navigate = useNavigate();

    if (accountIsLoading || !data)
        return <p className="text-red-500 dark:text-red-400">Loading...</p>;
    if (accountError)
        return <p className="text-red-500 dark:text-red-400">{accountError}</p>;

    const user = data.user;
    if (!user) return;

    const { user: userInfo } = data;
    if (!userInfo) return null;

    const followings = userInfo.followings.filter(
        (following) => following.approved
    );

    return (
        <div className="w-full px-6 py-10">
            <div className="mx-auto w-full max-w-5xl">
                <div className="mb-6 flex items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                            Followings
                        </h2>
                        <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">
                            People @{userInfo.username} follows
                        </p>
                    </div>

                    <span className="rounded-full bg-slate-100 ring-1 ring-slate-200/70 px-3 py-1 text-sm text-slate-700 dark:bg-white/10 dark:ring-white/10 dark:text-gray-200">
                        {followings.length} total
                    </span>
                </div>

                <div className="rounded-2xl bg-white ring-1 ring-slate-200/70 p-4 dark:bg-white/5 dark:ring-white/10">
                    {followings.length === 0 ? (
                        <div className="rounded-xl bg-slate-50 ring-1 ring-slate-200/70 p-10 text-center dark:bg-black/20 dark:ring-white/10">
                            <p className="text-sm text-slate-700 dark:text-gray-200">
                                No followings yet.
                            </p>
                            <p className="mt-1 text-xs text-slate-500 dark:text-gray-500">
                                When this account follows someone, they’ll
                                appear here.
                            </p>
                        </div>
                    ) : (
                        <ul className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                            {followings.map((following) => (
                                <FollowingItem
                                    key={following.receiver.id}
                                    user={following.receiver}
                                    onClick={(username) =>
                                        navigate(`/profile/${username}`)
                                    }
                                />
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Followings;
