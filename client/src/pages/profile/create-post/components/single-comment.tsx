import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import NiceModal from "@ebay/nice-modal-react";
import type { IComment, ICommentReaction, IContext } from "../../../../types";
import CommentMoreModal from "./comment-more-modal";
import { Axios } from "../../../../api";
import TimeAgo from "../../components/time-ago";
import MoreIcon from "../../../../utils/icons/more-icon";
import HeartIcon from "../../../../utils/icons/heart-icon";

const SingleComment = ({
    comment,
    commentCreated,
    handleDeleteComment,
}: {
    comment: IComment;
    commentCreated: string;
    handleDeleteComment: (commentId: number) => void;
}) => {
    const { account } = useOutletContext<IContext>();
    const [commentReactions, setCommentReactions] = useState<
        ICommentReaction[]
    >([]);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        setCommentReactions(comment.reactions || []);

        if (!comment.reactions) return;
        const reacted = comment.reactions.some(
            (comReaction) => comReaction.userId === account.id
        );
        setIsLiked(reacted);
    }, [comment.reactions, account.id]);

    const handleReact = () => {
        Axios.post<{
            commentReactionStatus: boolean;
            commentReaction: ICommentReaction;
        }>(`/posts/${comment.id}/comments/${comment.id}/reactions`).then(
            (response) => {
                setIsLiked(response.data.commentReactionStatus);

                if (
                    response.data.commentReactionStatus &&
                    response.data.commentReaction
                ) {
                    setCommentReactions((prev) => [
                        ...prev,
                        response.data.commentReaction,
                    ]);
                } else {
                    setCommentReactions((prev) =>
                        prev.filter((r) => r.userId !== account.id)
                    );
                }
            }
        );
    };

    const handleMoreClick = () => {
        NiceModal.show(CommentMoreModal, {
            commentId: comment.id,
            onDeleted: handleDeleteComment,
        });
    };

    return (
        <div className="group flex items-start justify-between gap-3 rounded-xl px-2 py-2 transition hover:bg-slate-100 dark:hover:bg-white/[0.03]">
            <div className="flex gap-3 min-w-0">
                {comment.user.avatarURL ? (
                    <img
                        src={comment.user.avatarURL}
                        alt="avatar"
                        className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-white/10"
                    />
                ) : (
                    <img
                        src={"/assets/default.jpeg"}
                        alt="avatar"
                        className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-white/10"
                    />
                )}

                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <p className="text-slate-900 dark:text-slate-100 text-[13.5px] font-semibold">
                            {comment.user.username}
                        </p>

                        <TimeAgo date={new Date(commentCreated)} />

                        {comment.userId === account.id && (
                            <MoreIcon
                                onClick={handleMoreClick}
                                className="
                                    duration-200 cursor-pointer
                                    invisible opacity-0 group-hover:visible group-hover:opacity-100
                                    fill-slate-500 hover:fill-slate-700
                                    dark:fill-neutral-400 dark:hover:fill-neutral-200
                                "
                            />
                        )}
                    </div>

                    <p className="mt-1 text-[14px] text-slate-700 dark:text-slate-200 break-words">
                        {comment.text}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-1 pt-1 shrink-0">
                {commentReactions.length > 0 && (
                    <span className="text-xs text-slate-500 dark:text-neutral-300">
                        {commentReactions.length}
                    </span>
                )}

                <HeartIcon
                    filled={false}
                    onClick={handleReact}
                    isLiked={isLiked}
                    className="w-4 h-4"
                />
            </div>
        </div>
    );
};

export default SingleComment;
