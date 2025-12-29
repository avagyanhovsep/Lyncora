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
        <div className="w-full rounded-2xl bg-white ring-1 ring-slate-200/70 overflow-hidden dark:bg-white/5 dark:ring-white/10">
            <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-5">
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
                            className="hidden sm:inline-flex rounded-xl bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500 active:scale-95 transition"
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
                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200/70 p-10 text-center dark:bg-black/20 dark:ring-white/10">
                        <p className="text-sm text-slate-700 dark:text-slate-200">
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
                                    className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm text-white hover:bg-indigo-500 active:scale-95 transition"
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
