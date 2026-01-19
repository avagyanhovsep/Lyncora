import type { IComment, IPost } from "../../../../types";
import SingleComment from "./single-comment";


const Comments = ({
    postInfo,
    comments,
    handleDeleteComment,
}: {
    postInfo: IPost;
    comments: IComment[];
    handleDeleteComment: (commentId: number) => void;
}) => {
    return (
        <div className="p-5 space-y-4">
            {postInfo.title.length > 0 ? (
                <div className="flex gap-3 pb-4 border-b border-slate-200 dark:border-white/10">
                    {postInfo.author.avatarURL ? (
                        <img
                            src={postInfo.author.avatarURL}
                            alt="avatar"
                            className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-200 dark:ring-white/10"
                        />
                    ) : (
                        <img
                            src={"/assets/default.jpeg"}
                            alt="avatar"
                            className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-200 dark:ring-white/10"
                        />
                    )}

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <p className="text-slate-900 dark:text-slate-100 text-[14px] font-semibold">
                                {postInfo.author.username}
                            </p>
                            <p className="text-[14px] text-slate-700 dark:text-slate-200 break-words">
                                {postInfo.title}
                            </p>
                        </div>

                        {postInfo.tags?.length ? (
                            <ul className="mt-2 flex flex-wrap gap-2">
                                {postInfo.tags.map((tag: string) => (
                                    <li
                                        key={tag}
                                        className="
                                            text-xs
                                            text-indigo-600 bg-indigo-500/10
                                            ring-1 ring-indigo-400/20
                                            px-2 py-1 rounded-full
                                            dark:text-indigo-300 dark:ring-indigo-400/15
                                        "
                                    >
                                        #{tag}
                                    </li>
                                ))}
                            </ul>
                        ) : null}
                    </div>
                </div>
            ) : null}

            <div className="space-y-3">
                {comments.map((comment: IComment) => (
                    <SingleComment
                        key={comment.id}
                        comment={comment}
                        commentCreated={comment.createdAt}
                        handleDeleteComment={handleDeleteComment}
                    />
                ))}
            </div>
        </div>
    );
};

export default Comments;
