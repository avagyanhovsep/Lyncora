import ReactModal from "react-modal";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { Link, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { useHttpGet } from "../../../../utils/hooks/useHttp";
import type {
    IComment,
    IContext,
    IPost,
    IPostReaction,
} from "../../../../types";
import { Axios } from "../../../../api";
import DeletePostBtn from "../components/delete-post-button";
import Comments from "../components/comments";
import LikeSection from "../components/like-section";

type Props = {
    onClose: () => void;
    postId: number;
    handleDeletePost?: (postId: number) => void;
};

const ImageViewer = ({ onClose, postId, handleDeletePost }: Props) => {
    const { data: postData } = useHttpGet<{ postInfo: IPost }>(
        `/posts/${postId}`,
    );

    const { control, handleSubmit, reset, watch } = useForm<IComment>({
        defaultValues: { text: "" },
    });

    const { account } = useOutletContext<IContext>();

    const [comments, setComments] = useState<IComment[]>([]);
    const [reactions, setReactions] = useState<IPostReaction[]>([]);
    const [isLiked, setIsLiked] = useState(false);
    const [showCommentsMobile, setShowCommentsMobile] = useState(false);

    const commentText = watch("text", "");

    useEffect(() => {
        if (!postData?.postInfo) return;

        const { postComments, postReactions } = postData.postInfo;

        setComments(postComments);
        setReactions(postReactions);

        const reacted =
            postReactions.some((r) => r.userId === account.id) ?? false;
        setIsLiked(reacted);
    }, [postData, account.id]);

    useEffect(() => {
        setShowCommentsMobile(false);
        reset({ text: "" });
    }, [postId, reset]);

    if (!postData?.postInfo) return null;
    const postInfo = postData.postInfo;

    const handleAddComment: SubmitHandler<IComment> = (comment) => {
        const trimmed = comment.text?.trim();
        if (!trimmed) return;

        Axios.post<{ comment: IComment }>(`/posts/${postId}/comments`, {
            text: trimmed,
        }).then((response) => {
            setComments((prev) => [...prev, response.data.comment]);
            reset({ text: "" }); 
        });
    };

    const handleDeleteComment = (commentId: number) => {
        setComments((prev) =>
            prev.filter((comment) => comment.id !== commentId),
        );
    };

    const handleAddReaction = () => {
        Axios.post<{ reactionStatus: boolean; reaction: IPostReaction }>(
            `/posts/${postInfo.id}/likes`,
        ).then((response) => {
            setIsLiked(response.data.reactionStatus);

            if (response.data.reactionStatus && response.data.reaction) {
                setReactions((prev) => [...prev, response.data.reaction]);
            } else {
                setReactions((prev) =>
                    prev.filter((r) => r.userId !== account.id),
                );
            }
        });
    };

    return (
        <ReactModal
            isOpen={true}
            ariaHideApp={false}
            onRequestClose={onClose}
            shouldCloseOnOverlayClick
            shouldCloseOnEsc
            bodyOpenClassName="overflow-hidden"
            portalClassName="z-[9999]"
            overlayClassName="fixed inset-0 z-[99] bg-black/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-3 md:p-6"
            className="outline-none border-0 p-0 m-0 bg-transparent w-full flex justify-center items-center"
        >
            <div className="relative w-full max-w-6xl h-auto max-h-[92dvh] sm:h-[90dvh] md:h-[88dvh] rounded-2xl overflow-hidden bg-white ring-1 ring-slate-200/70 shadow-2xl flex flex-col lg:flex-row dark:bg-neutral-950 dark:ring-white/10">
                <div className="shrink-0 w-full lg:hidden sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200/70 px-4 py-3 dark:bg-neutral-950/95 dark:border-white/10">
                    <div className="flex items-center justify-between gap-4">
                        <Link to="/profile" className="min-w-0">
                            <div className="flex items-center gap-3">
                                <img
                                    src={
                                        postInfo.author.avatarURL ||
                                        "/assets/default.jpeg"
                                    }
                                    alt="avatar"
                                    className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200/70 dark:ring-white/10"
                                />
                                <div className="min-w-0">
                                    <p className="text-[15px] font-semibold truncate dark:text-slate-100">
                                        {postInfo.author.username}
                                    </p>
                                    <p className="text-[12px] text-slate-500 truncate dark:text-slate-400">
                                        {postInfo.location || " "}
                                    </p>
                                </div>
                            </div>
                        </Link>

                        <div className="flex items-center gap-2">
                            {postInfo.authorId === account.id && (
                                <DeletePostBtn
                                    postId={postInfo.id}
                                    onClose={onClose}
                                    handleDeletePost={handleDeletePost}
                                />
                            )}
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-black/60 ring-1 ring-white/10 inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white hover:bg-black/70 active:scale-95 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>

                <div className="relative bg-black flex items-center justify-center lg:flex-1 min-h-0">
                    <div className="w-full h-[42dvh] sm:h-[52dvh] md:h-[55dvh] lg:h-full flex items-center justify-center overflow-hidden">
                        <img
                            src={postInfo.postImageURL}
                            alt="Preview"
                            className="h-full w-full object-contain"
                        />
                    </div>
                </div>

                <aside className="flex-1 lg:flex-none lg:w-[420px] xl:w-[500px] flex flex-col text-slate-900 border-t border-slate-200/70 lg:border-t-0 lg:border-l lg:border-slate-200/70 bg-white min-h-0 dark:text-neutral-200 dark:border-white/10 dark:bg-neutral-950">
                    <div className="hidden lg:block sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200/70 px-4 sm:px-5 py-4 dark:bg-neutral-950/95 dark:border-white/10">
                        <div className="flex items-center justify-between gap-4">
                            <Link to="/profile" className="min-w-0">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={
                                            postInfo.author.avatarURL ||
                                            "/assets/default.jpeg"
                                        }
                                        alt="avatar"
                                        className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-200/70 dark:ring-white/10"
                                    />
                                    <div className="min-w-0">
                                        <p className="text-[15px] font-semibold truncate dark:text-slate-100">
                                            {postInfo.author.username}
                                        </p>
                                        <p className="text-[12px] text-slate-500 truncate dark:text-slate-400">
                                            {postInfo.location || " "}
                                        </p>
                                    </div>
                                </div>
                            </Link>

                            <div className="flex items-center gap-2">
                                {postInfo.authorId === account.id && (
                                    <DeletePostBtn
                                        postId={postInfo.id}
                                        onClose={onClose}
                                        handleDeletePost={handleDeletePost}
                                    />
                                )}
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="bg-black/60 ring-1 ring-white/10 inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white hover:bg-black/70 active:scale-95 transition"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 min-h-0 overflow-y-auto">
                        <div className="hidden sm:block">
                            <Comments
                                postInfo={postInfo}
                                comments={comments}
                                handleDeleteComment={handleDeleteComment}
                            />
                        </div>

                        <div className="sm:hidden px-4 py-4">
                            <p className="text-[14px] text-slate-700 dark:text-neutral-300">
                                {postInfo.description || " "}
                            </p>

                            <button
                                type="button"
                                onClick={() => setShowCommentsMobile(true)}
                                className="mt-3 text-[13px] text-slate-500 hover:text-slate-700 transition dark:text-slate-400 dark:hover:text-slate-200"
                            >
                                View comments ({comments.length})
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-slate-200/70 bg-white dark:border-white/10 dark:bg-neutral-950">
                        <LikeSection
                            postInfo={postInfo}
                            comments={comments}
                            reactions={reactions}
                            handleAddReaction={handleAddReaction}
                            isLiked={isLiked}
                            onCommentClick={() => setShowCommentsMobile(true)}
                        />

                        {/* Desktop comment input */}
                        <form
                            onSubmit={handleSubmit(handleAddComment)}
                            className="hidden sm:flex px-3 sm:px-4 py-3 border-t border-slate-200/70 items-center gap-3 dark:border-white/10"
                        >
                            <Controller
                                name="text"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        placeholder="Add a comment…"
                                        autoComplete="off"
                                        className="flex-1 rounded-xl bg-slate-50 ring-1 ring-slate-200/70 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none
                                                   dark:bg-white/5 dark:ring-white/10 dark:text-slate-100 dark:placeholder:text-slate-500"
                                    />
                                )}
                            />
                            <button
                                type="submit"
                                disabled={!commentText.trim()}
                                className="rounded-xl px-3 py-2 text-sm font-semibold text-indigo-700 disabled:opacity-30 transition dark:text-indigo-300"
                            >
                                Post
                            </button>
                        </form>
                    </div>
                </aside>

                <div
                    className={`sm:hidden absolute inset-0 z-50 bg-white dark:bg-neutral-950 flex flex-col transition-transform duration-200 ease-out ${
                        showCommentsMobile
                            ? "translate-x-0"
                            : "translate-x-full"
                    }`}
                    aria-hidden={!showCommentsMobile}
                >
                    <div className="shrink-0 flex items-center gap-2 px-3 py-3 border-b border-slate-200/70 dark:border-white/10">
                        <button
                            type="button"
                            onClick={() => setShowCommentsMobile(false)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl hover:bg-slate-100 active:scale-95 transition dark:hover:bg-white/5"
                            aria-label="Back"
                        >
                            <span className="text-[18px] leading-none text-slate-900 dark:text-slate-100">
                                ←
                            </span>
                        </button>

                        <div className="min-w-0">
                            <p className="text-[15px] font-semibold dark:text-slate-100">
                                Comments
                            </p>
                            <p className="text-[12px] text-slate-500 dark:text-slate-400">
                                {comments.length}{" "}
                                {comments.length === 1 ? "comment" : "comments"}
                            </p>
                        </div>
                    </div>

                    <div className="flex-1 min-h-0 overflow-y-auto">
                        <Comments
                            postInfo={postInfo}
                            comments={comments}
                            handleDeleteComment={handleDeleteComment}
                        />
                    </div>

                    <form
                        onSubmit={handleSubmit(handleAddComment)}
                        className="shrink-0 px-3 py-3 border-t border-slate-200/70 flex items-center gap-3 dark:border-white/10"
                    >
                        <Controller
                            name="text"
                            control={control}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    placeholder="Add a comment…"
                                    autoComplete="off"
                                    className="flex-1 rounded-xl bg-slate-50 ring-1 ring-slate-200/70 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none
                                               dark:bg-white/5 dark:ring-white/10 dark:text-slate-100 dark:placeholder:text-slate-500"
                                />
                            )}
                        />
                        <button
                            type="submit"
                            disabled={!commentText.trim()}
                            className="rounded-xl px-3 py-2 text-sm font-semibold text-indigo-700 disabled:opacity-30 transition dark:text-indigo-300"
                        >
                            Post
                        </button>
                    </form>
                </div>
            </div>
        </ReactModal>
    );
};

export default ImageViewer;
