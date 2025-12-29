import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Axios } from "../../../../api.ts";

type Props = {
    commentId: number;
    onDeleted: (commentId: number) => void;
};

const CommentMoreModal = NiceModal.create(({ commentId, onDeleted }: Props) => {
    const modal = useModal();

    const handleClose = () => {
        modal.hide();
    };

    const handleDeleteComment = async () => {
        await Axios.delete(`/posts/${commentId}/comments/${commentId}`).then(
            () => {
                onDeleted(commentId);
                handleClose();
            }
        );
    };

    return (
        <div
            className={`
                absolute inset-0 z-[999]
                flex items-end justify-center sm:items-center
                bg-black/40
                transition-opacity duration-200
                ${
                    modal.visible
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                }
            `}
            onClick={handleClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`
                    w-full max-w-xs rounded-xl
                    bg-white text-slate-900 ring-1 ring-slate-200/70
                    p-3 mb-6 sm:mb-0
                    transform transition-transform duration-200
                    ${modal.visible ? "translate-y-0" : "translate-y-4"}
                    dark:bg-neutral-900 dark:text-slate-100 dark:ring-white/10
                `}
            >
                <button
                    type="button"
                    className="w-full px-4 py-3 text-sm text-left rounded-xl
                               hover:bg-slate-50 text-red-600
                               dark:hover:bg-white/10 dark:text-red-400"
                    onClick={handleDeleteComment}
                >
                    Delete comment
                </button>
            </div>
        </div>
    );
});

export default CommentMoreModal;
