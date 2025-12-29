import type { IComment, IPost, IPostReaction } from "../../../../types";
import CommentIcon from "../../../../utils/icons/comment-icon";
import HeartIcon from "../../../../utils/icons/heart-icon";
import TimeAgo from "../../components/time-ago";


const LikeSection = ({
    postInfo,
    comments,
    handleAddReaction,
    isLiked,
    reactions,
}: {
    postInfo: IPost;
    comments: IComment[];
    handleAddReaction: () => void;
    isLiked: boolean;
    reactions: IPostReaction[];
}) => {
    return (
        <div className="w-full px-5 py-3 text-slate-900 dark:text-neutral-200">
            <div className="w-full flex justify-between items-center">
                <div className="flex gap-5">
                    <button
                        type="button"
                        className="flex items-center gap-1 hover:opacity-90 transition"
                        onClick={handleAddReaction}
                    >
                        <HeartIcon
                            filled={false}
                            isLiked={isLiked}
                            className="w-6 h-6"
                        />
                        <span className="text-sm text-slate-700 dark:text-neutral-200">
                            {reactions.length}
                        </span>
                    </button>

                    <div className="flex items-center gap-1.5">
                        <CommentIcon filled={false} className="w-5 h-5" />
                        <span className="text-sm text-slate-700 dark:text-neutral-200">
                            {comments.length}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-2 text-slate-500 dark:text-slate-400">
                <TimeAgo date={new Date(postInfo.createdAt)} />
            </div>
        </div>
    );
};

export default LikeSection;
