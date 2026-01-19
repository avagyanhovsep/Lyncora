import { useMemo } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { Axios } from "../../../api.ts";
import type {
    IAccount,
    IContext,
    IFollowing,
    IRawFollowing,
} from "../../../types.ts";
import { useHttpGet } from "../../../utils/hooks/useHttp.ts";
import LockIcon from "../../../utils/icons/lock-icon-icon.tsx";
import FollowButton from "./components/follow-button.tsx";
import MessageButton from "./components/message-button.tsx";
import ProfileAvatar from "../components/profile-avatar.tsx";
import ProfileStats from "../components/profile-stats.tsx";
import ProfilePostsCard from "../components/profile-post-card.tsx";

const UserProfile = () => {
    const { username } = useParams();
    const { account, setAccount } = useOutletContext<IContext>();

    const {
        data,
        isLoading: accountIsLoading,
        error: accountError,
        refetch,
    } = useHttpGet<{ user: IAccount }>(`/account/${username}`);

    const userInfo = data?.user;

    const followersCount = useMemo(
        () =>
            userInfo?.followers.filter((follower) => follower.approved)
                .length ?? 0,
        [userInfo?.followers]
    );

    const followingsCount = useMemo(
        () =>
            userInfo?.followings.filter((following) => following.approved)
                .length ?? 0,
        [userInfo?.followings]
    );

    if (accountIsLoading || !data)
        return <p className="text-red-500 dark:text-red-400">Loading...</p>;

    if (accountError)
        return <p className="text-red-500 dark:text-red-400">{accountError}</p>;

    if (!userInfo) return null;

    const amIFollowing = userInfo.followers.find(
        (follower: IRawFollowing) => follower.from == account.id
    );

    const requested = userInfo.followers.find(
        (follower: IRawFollowing) =>
            follower.from == account.id && !follower.approved
    );

    const isApproved = userInfo.followers.find(
        (follower: IRawFollowing) => follower.from == account.id
    )?.approved;

    const canSeePosts = !userInfo.isAccountPrivate || isApproved;
    const canMessage = !userInfo.isAccountPrivate || isApproved;
    const showMessageButton = userInfo.id !== account.id && canMessage;

    const handleFollow = () => {
        Axios.post(`/follow/${userInfo.id}`).then((response) => {
            const { status } = response.data;

            if (status === "Followed") {
                const result = response.data.result;
                const nextFollowings: IFollowing[] = [
                    ...account.followings,
                    result,
                ];
                setAccount({ ...account, followings: nextFollowings });
            }

            if (status === "Unfollowed") {
                const nextFollowings: IFollowing[] = account.followings.filter(
                    (following) =>
                        !(
                            following.from === account.id &&
                            following.to === userInfo.id
                        )
                );
                setAccount({ ...account, followings: nextFollowings });
            }

            refetch();
        });
    };

    const handleDeletePost = async (postId: number) => {
        await Axios.delete(`/posts/${postId}`);

        if (userInfo.id === account.id) {
            setAccount({
                ...account,
                posts: account.posts.filter((post) => post.id !== postId),
            });
        }

        refetch();
    };

    const showPrivateBadge = userInfo.isAccountPrivate && !canSeePosts;

    return (
        <div className="w-full px-4 sm:px-6 py-8 flex justify-center">
            <div className="w-full max-w-5xl flex flex-col gap-8">
                <section className="rounded-3xl bg-white ring-1 ring-slate-200/70 p-5 sm:p-6 dark:bg-white/5 dark:ring-white/10">
                    <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
                        <div className="shrink-0 flex items-center gap-4">
                            <div className="relative">
                                <div className="ring-2 ring-slate-200/70 dark:ring-white/15 rounded-full">
                                    <ProfileAvatar
                                        src={userInfo.avatarURL}
                                        size="md"
                                    />
                                </div>
                                <div className="pointer-events-none absolute -inset-2 rounded-full blur-xl bg-slate-200/40 dark:bg-white/5" />
                            </div>

                            <div className="md:hidden">
                                <div className="flex items-center gap-2">
                                    <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                                        {userInfo.username}
                                    </h1>

                                    {showPrivateBadge && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/10 dark:text-slate-200 dark:ring-white/10">
                                            <LockIcon className="w-4 h-4 stroke-slate-700 dark:stroke-white" />
                                            Private
                                        </span>
                                    )}
                                </div>

                                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                    @{userInfo.username}
                                </p>
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="hidden md:flex items-center justify-between gap-4">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <h1 className="truncate text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                                            {userInfo.username}
                                        </h1>

                                        {showPrivateBadge && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/10 dark:text-slate-200 dark:ring-white/10">
                                                <LockIcon className="w-4 h-4 stroke-slate-700 dark:stroke-white" />
                                                Private
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                        @{userInfo.username}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <FollowButton
                                        handleFollow={handleFollow}
                                        requested={requested}
                                        amIFollowing={amIFollowing}
                                    />
                                    {showMessageButton && (
                                        <MessageButton id={userInfo.id} />
                                    )}
                                </div>
                            </div>

                            <div className="md:hidden mt-4 flex items-center gap-2">
                                <FollowButton
                                    handleFollow={handleFollow}
                                    requested={requested}
                                    amIFollowing={amIFollowing}
                                />
                                {showMessageButton && (
                                    <MessageButton id={userInfo.id} />
                                )}
                            </div>

                            <div className="mt-6">
                                <ProfileStats
                                    username={userInfo.username}
                                    postsCount={userInfo.posts.length}
                                    followersCount={followersCount}
                                    followingsCount={followingsCount}
                                    linkFollowers
                                    linkFollowings
                                />
                            </div>

                            <div className="mt-5 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200/70 dark:bg-black/25 dark:ring-white/10">
                                <p className="text-sm text-slate-700 leading-relaxed dark:text-slate-300">
                                    {userInfo.bio?.trim()
                                        ? userInfo.bio
                                        : "No bio yet."}
                                </p>
                            </div>

                            {showPrivateBadge && (
                                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200/70 p-4 dark:bg-white/5 dark:ring-white/10">
                                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                                        <LockIcon className="w-5 h-5 stroke-slate-700 dark:stroke-white" />
                                        <p className="text-sm">
                                            This account is private. Follow to
                                            see posts.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <ProfilePostsCard
                    posts={userInfo.posts ?? []}
                    canSeePosts={canSeePosts}
                    onDeletePost={handleDeletePost}
                />
            </div>
        </div>
    );
};

export default UserProfile;
