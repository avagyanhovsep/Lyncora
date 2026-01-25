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
        [userInfo?.followers],
    );

    const followingsCount = useMemo(
        () =>
            userInfo?.followings.filter((following) => following.approved)
                .length ?? 0,
        [userInfo?.followings],
    );

    if (accountIsLoading || !data)
        return <p className="text-red-500 dark:text-red-400">Loading...</p>;

    if (accountError)
        return <p className="text-red-500 dark:text-red-400">{accountError}</p>;

    if (!userInfo) return null;

    const amIFollowing = userInfo.followers.find(
        (follower: IRawFollowing) => follower.from == account.id,
    );

    const requested = userInfo.followers.find(
        (follower: IRawFollowing) =>
            follower.from == account.id && !follower.approved,
    );

    const isApproved = userInfo.followers.find(
        (follower: IRawFollowing) => follower.from == account.id,
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
                        ),
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
        <div className="w-full px-4 sm:px-6 py-10">
            <div className="mx-auto w-full max-w-5xl flex flex-col gap-6">
                {/* Header card (same spacing as your Account page) */}
                <section
                    className="
                        w-full rounded-3xl overflow-hidden
                        ring-1 ring-slate-200/70 bg-white
                        shadow-[0_20px_60px_-40px_rgba(0,0,0,0.35)]
                        dark:bg-white/[0.04] dark:ring-white/10
                    "
                >
                    <div className="relative p-6 md:p-8">
                        <div
                            className="
                                pointer-events-none absolute inset-0
                                bg-gradient-to-br from-slate-50/80 via-transparent to-slate-100/60
                                dark:from-white/[0.06] dark:via-transparent dark:to-white/[0.02]
                            "
                        />
                        <div className="relative flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
                            <div className="shrink-0 flex items-center gap-4">
                                <div className="relative">
                                    <div className="rounded-full ring-2 ring-white/70 shadow-lg shadow-black/20 dark:ring-white/10">
                                        <ProfileAvatar
                                            src={userInfo.avatarURL}
                                            size="md"
                                        />
                                    </div>
                                    <div className="pointer-events-none absolute -inset-3 rounded-full blur-2xl bg-slate-200/30 dark:bg-white/5" />
                                </div>

                                {/* Mobile name row (compact, app-like) */}
                                <div className="md:hidden min-w-0">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <h1 className="truncate text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                                            {userInfo.username}
                                        </h1>

                                        {showPrivateBadge && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100/80 ring-1 ring-slate-200/70 px-2.5 py-1 text-xs text-slate-700 backdrop-blur dark:bg-white/10 dark:ring-white/10 dark:text-gray-200">
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

                            <div className="flex-1 min-w-0 flex flex-col gap-5">
                                {/* Desktop top row */}
                                <div className="hidden md:flex items-center justify-between gap-4">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <h1 className="truncate text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                                                {userInfo.username}
                                            </h1>

                                            {showPrivateBadge && (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100/80 ring-1 ring-slate-200/70 px-3 py-1 text-xs text-slate-700 backdrop-blur dark:bg-white/10 dark:ring-white/10 dark:text-gray-200">
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

                                {/* Mobile actions */}
                                <div className="md:hidden flex items-center gap-2">
                                    <FollowButton
                                        handleFollow={handleFollow}
                                        requested={requested}
                                        amIFollowing={amIFollowing}
                                    />
                                    {showMessageButton && (
                                        <MessageButton id={userInfo.id} />
                                    )}
                                </div>

                                <ProfileStats
                                    username={userInfo.username}
                                    postsCount={userInfo.posts.length}
                                    followersCount={followersCount}
                                    followingsCount={followingsCount}
                                    linkFollowers
                                    linkFollowings
                                />

                                {/* Bio */}
                                {userInfo.bio?.trim() && (
                                    <div
                                        className="
                                            rounded-2xl p-4
                                            bg-slate-50/80 ring-1 ring-slate-200/70
                                            dark:bg-black/20 dark:ring-white/10
                                        "
                                    >
                                        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                                            {userInfo.bio}
                                        </p>
                                    </div>
                                )}

                                {/* Private notice */}
                                {showPrivateBadge && (
                                    <div
                                        className="
                                            rounded-2xl p-4
                                            bg-slate-50/80 ring-1 ring-slate-200/70
                                            dark:bg-white/[0.04] dark:ring-white/10
                                        "
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/70 ring-1 ring-slate-200/70 dark:bg-black/20 dark:ring-white/10">
                                                <LockIcon className="w-5 h-5 stroke-slate-700 dark:stroke-white" />
                                            </span>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                    Private account
                                                </p>
                                                <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
                                                    Follow to see posts and
                                                    message this user.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="h-px w-full bg-slate-200/70 dark:bg-white/10" />
                </section>

                {/* Posts card (your rich one already) */}
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
