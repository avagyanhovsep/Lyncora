import ReactModal from "react-modal";
import { useForm, type SubmitHandler } from "react-hook-form";
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
import Image from "../../components/image";
import DeletePostBtn from "../components/delete-post-button";
import Comments from "../components/comments";
import LikeSection from "../components/like-section";

type Props = {
    onClose: () => void;
    postId: number;
    handleDeletePost?: () => void;
};

const ImageViewer = ({ onClose, postId, handleDeletePost }: Props) => {
    const { data: postData } = useHttpGet<{ postInfo: IPost }>(
        `/posts/${postId}`
    );
    const { register, handleSubmit, reset, watch } = useForm<IComment>();
    const { account } = useOutletContext<IContext>();

    const [comments, setComments] = useState<IComment[]>([]);
    const [reactions, setReactions] = useState<IPostReaction[]>([]);
    const [isLiked, setIsLiked] = useState(false);

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

    if (!postData?.postInfo) return null;
    const postInfo = postData.postInfo;

    const handleAddComment: SubmitHandler<IComment> = (comment: IComment) => {
        Axios.post<{ comment: IComment }>(`/posts/${postId}/comments`, {
            text: comment.text,
        }).then((response) => {
            setComments((prevComments) => [
                ...prevComments,
                response.data.comment,
            ]);
            reset();
        });
    };

    const handleDeleteComment = (commentId: number) => {
        setComments((prevComments) =>
            prevComments.filter((comment) => comment.id !== commentId)
        );
    };

    const handleAddReaction = () => {
        Axios.post<{ reactionStatus: boolean; reaction: IPostReaction }>(
            `/posts/${postInfo.id}/likes`
        ).then((response) => {
            setIsLiked(response.data.reactionStatus);

            if (response.data.reactionStatus && response.data.reaction) {
                setReactions((prev) => [...prev, response.data.reaction]);
            } else {
                setReactions((prev) =>
                    prev.filter((reaction) => reaction.userId !== account.id)
                );
            }
        });
    };

    return (
        <ReactModal
            isOpen={true}
            ariaHideApp={false}
            onRequestClose={onClose}
            shouldCloseOnOverlayClick={true}
            shouldCloseOnEsc={true}
            bodyOpenClassName="overflow-hidden"
            portalClassName="z-[9999]"
            overlayClassName="fixed inset-0 z-[99] bg-black/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-3 md:p-6"
            className="outline-none border-0 p-0 m-0 bg-transparent w-full lg:w-fit flex justify-center items-center"
        >
            <div className="w-full max-w-6xl h-[92vh] sm:h-[90vh] md:h-[88vh] rounded-2xl overflow-hidden bg-white ring-1 ring-slate-200/70 shadow-2xl flex flex-col lg:flex-row dark:bg-neutral-950 dark:ring-white/10">
                <div className="relative bg-black flex items-center justify-center lg:flex-1">
                    <div className="w-full h-[45vh] sm:h-[52vh] md:h-[55vh] lg:h-full flex items-center justify-center">
                        <Image
                            src={postInfo.postImage}
                            alt="Preview"
                            className="h-full w-full object-contain"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-3 right-3 lg:hidden rounded-xl bg-black/60 ring-1 ring-white/10 px-3 py-2 text-xs text-white hover:bg-black/70 active:scale-95 transition"
                    >
                        Close
                    </button>
                </div>

                <aside className="lg:w-[420px] xl:w-[500px] flex flex-col text-slate-900 border-t border-slate-200/70 lg:border-t-0 lg:border-l lg:border-slate-200/70 bg-white min-h-0 dark:text-neutral-200 dark:border-white/10 dark:bg-neutral-950">
                    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-200/70 px-4 sm:px-5 py-4 dark:bg-neutral-950/95 dark:border-white/10">
                        <div className="w-full flex items-center justify-between gap-4">
                            <Link to={"/profile"} className="min-w-0">
                                <div className="flex items-center gap-3">
                                    {postInfo.author.avatar ? (
                                        <Image
                                            src={postInfo.author.avatar}
                                            alt="avatar"
                                            className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-200/70 dark:ring-white/10"
                                        />
                                    ) : (
                                        <img
                                            src={"/assets/default.jpeg"}
                                            alt="avatar"
                                            className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-200/70 dark:ring-white/10"
                                        />
                                    )}

                                    <div className="min-w-0">
                                        <p className="text-slate-900 text-[15px] font-semibold truncate dark:text-slate-100">
                                            {postInfo?.author?.username}
                                        </p>
                                        <p className="text-[12px] text-slate-500 truncate dark:text-slate-400">
                                            {postInfo?.location || " "}
                                        </p>
                                    </div>
                                </div>
                            </Link>

                            {postInfo.authorId == account.id && (
                                <DeletePostBtn
                                    handleDeletePost={handleDeletePost}
                                    onClose={onClose}
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex-1 min-h-0 overflow-y-auto">
                        <Comments
                            postInfo={postInfo}
                            comments={comments}
                            handleDeleteComment={handleDeleteComment}
                        />
                    </div>

                    <div className="border-t border-slate-200/70 bg-white dark:border-white/10 dark:bg-neutral-950">
                        <LikeSection
                            postInfo={postInfo}
                            comments={comments}
                            reactions={reactions}
                            handleAddReaction={handleAddReaction}
                            isLiked={isLiked}
                        />

                        <form
                            className="px-3 sm:px-4 py-3 border-t border-slate-200/70 flex items-center gap-3 dark:border-white/10"
                            onSubmit={handleSubmit(handleAddComment)}
                        >
                            <input
                                id="text"
                                type="text"
                                {...register("text")}
                                placeholder="Add a comment…"
                                autoComplete="off"
                                className="flex-1 rounded-xl bg-slate-50 ring-1 ring-slate-200/70 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-slate-300
                                           dark:bg-white/5 dark:ring-white/10 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-white/20"
                            />
                            <button
                                type="submit"
                                disabled={!commentText.trim()}
                                className="rounded-xl px-3 py-2 text-sm font-semibold text-indigo-700 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition
                                           dark:text-indigo-300 dark:hover:text-indigo-200"
                            >
                                Post
                            </button>
                        </form>
                    </div>
                </aside>
            </div>
        </ReactModal>
    );
};

export default ImageViewer;
