import { useMemo, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { IContext } from "../../types.ts";
import { Axios } from "../../api.ts";
import SettingsIcon from "../../utils/icons/settings-icon.tsx";
import LockIcon from "../../utils/icons/lock-icon-icon.tsx";
import ProfileAvatar from "./components/profile-avatar.tsx";
import ProfileHeaderCard from "./components/profile-header-card.tsx";
import ProfileStats from "./components/profile-stats.tsx";
import ProfileBio from "./components/profile-bio.tsx";
import ProfilePostsCard from "./components/profile-post-card.tsx";

const Account = () => {
    const { account, setAccount } = useOutletContext<IContext>();
    const navigate = useNavigate();

    const avatarPicture = useRef<HTMLInputElement | null>(null);

    const followersCount = useMemo(
        () => account.followers.filter((follower) => follower.approved).length,
        [account.followers]
    );

    const followingsCount = useMemo(
        () =>
            account.followings.filter((following) => following.approved).length,
        [account.followings]
    );

    const handleAvatarUpload = () => {
        const file = avatarPicture.current?.files?.[0];
        if (!file) return;

        const form = new FormData();
        form.append("profile-pic", file);

        Axios.patch<{ picture: string }>("/account/avatar", form)
            .then((response) =>
                setAccount({
                    ...account,
                    avatar: response.data.picture,
                })
            )
            .catch((err) => console.log(err));
    };

    const handleDeletePost = async (postId: number) => {
        await Axios.delete<{ message: string }>(`/posts/${postId}`);

        setAccount({
            ...account,
            posts: account.posts.filter((post) => post.id !== postId),
        });
    };

    return (
        <div className="w-full px-6 py-10">
            <div className="mx-auto w-full max-w-5xl flex flex-col gap-6">
                <ProfileHeaderCard>
                    <div className="w-full flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
                        <div className="shrink-0">
                            <input
                                type="file"
                                ref={avatarPicture}
                                className="hidden"
                                onChange={handleAvatarUpload}
                            />

                            <ProfileAvatar
                                src={account.avatar}
                                editable
                                onPickFile={() =>
                                    avatarPicture.current?.click()
                                }
                            />
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col gap-5">
                            <div className="w-full flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className="text-2xl font-semibold text-slate-900 truncate dark:text-white">
                                        {account.username}
                                    </span>

                                    {account.isAccountPrivate && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 ring-1 ring-slate-200/70 px-2.5 py-1 text-xs text-slate-700 dark:bg-white/10 dark:ring-white/10 dark:text-gray-200">
                                            <LockIcon className="w-4 h-4 stroke-slate-700 shrink-0 dark:stroke-white" />
                                            Private
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        className="text-sm bg-slate-100 px-4 py-2 rounded-xl ring-1 ring-slate-200/70 duration-300 hover:bg-slate-200/70 active:scale-95 dark:bg-white/10 dark:ring-white/10 dark:hover:bg-white/15"
                                        onClick={() =>
                                            navigate("/profile/edit")
                                        }
                                    >
                                        Edit Profile
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate("/profile/settings")
                                        }
                                        className="p-2 rounded-xl ring-1 ring-slate-200/70 hover:bg-slate-100 transition active:scale-95 dark:ring-white/10 dark:hover:bg-white/10"
                                        title="Settings"
                                    >
                                        <SettingsIcon />
                                    </button>
                                </div>
                            </div>

                            <ProfileStats
                                username={account.username}
                                postsCount={account.posts.length}
                                followersCount={followersCount}
                                followingsCount={followingsCount}
                                linkFollowers
                                linkFollowings
                            />

                            <ProfileBio bio={account.bio} emptyText="" />
                        </div>
                    </div>
                </ProfileHeaderCard>

                <ProfilePostsCard
                    posts={account.posts}
                    onCreatePost={() => navigate("/profile/create-new-post")}
                    onDeletePost={handleDeletePost}
                />
            </div>
        </div>
    );
};

export default Account;
