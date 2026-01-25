import { useState } from "react";
import PhotoGrid from "../create-post/helpers/photo-grid";
import ImageViewer from "../create-post/helpers/image-viewer";
import type { IPost } from "../../../types";

type Props<TPost extends { id: number }> = {
    posts: TPost[];
    title?: string;
    subtitle?: string;
    canSeePosts?: boolean;
    onCreatePost?: () => void;
    onDeletePost?: (postId: number) => void;
};

export default function ProfilePostsCard<TPost extends { id: number }>({
    posts,
    title = "Posts",
    subtitle,
    canSeePosts = true,
    onCreatePost,
    onDeletePost,
}: Props<TPost>) {
    const [currentPost, setCurrentPost] = useState(-1);

    return (
        <div
            className="
                w-full rounded-3xl overflow-hidden
                ring-1 ring-slate-200/70 bg-white
                shadow-[0_20px_60px_-40px_rgba(0,0,0,0.35)]
                dark:bg-white/[0.04] dark:ring-white/10
            "
        >
            <div className="p-6 md:p-8">
                <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                            {title}
                        </h2>
                        <p className="mt-1 text-xs text-slate-500 dark:text-gray-500">
                            {subtitle ??
                                (canSeePosts
                                    ? `${posts.length} total`
                                    : "Hidden")}
                        </p>
                    </div>

                    {onCreatePost && (
                        <button
                            type="button"
                            onClick={onCreatePost}
                            className="
                                inline-flex items-center justify-center
                                rounded-full px-4 py-2 text-sm font-medium
                                bg-indigo-600 text-white shadow-lg shadow-indigo-600/20
                                active:scale-95 transition
                                md:hover:bg-indigo-500
                            "
                        >
                            Create post
                        </button>
                    )}
                </div>

                {!canSeePosts ? (
                    <div className="py-10 text-center text-slate-600 dark:text-slate-400">
                        Hidden
                    </div>
                ) : posts.length === 0 ? (
                    <div
                        className="
                            rounded-2xl p-10 text-center
                            bg-slate-50/80 ring-1 ring-slate-200/70
                            dark:bg-black/20 dark:ring-white/10
                        "
                    >
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                            No posts yet.
                        </p>

                        {onCreatePost && (
                            <>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                                    Create your first post to start building
                                    your profile.
                                </p>
                                <button
                                    type="button"
                                    onClick={onCreatePost}
                                    className="
                                        mt-5 rounded-full px-5 py-2.5 text-sm font-medium
                                        bg-indigo-600 text-white shadow-lg shadow-indigo-600/20
                                        active:scale-95 transition
                                        md:hover:bg-indigo-500
                                    "
                                >
                                    Create a post
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="w-full">
                        {currentPost !== -1 && (
                            <ImageViewer
                                handleDeletePost={
                                    onDeletePost
                                        ? () => onDeletePost(currentPost)
                                        : undefined
                                }
                                onClose={() => setCurrentPost(-1)}
                                postId={currentPost}
                            />
                        )}

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <PhotoGrid
                                posts={posts as unknown as IPost[]}
                                openPost={setCurrentPost}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
