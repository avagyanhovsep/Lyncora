import NiceModal from "@ebay/nice-modal-react";
import { Axios } from "../../../../api.ts";
import ConfirmModal from "../../components/confirm-modal.tsx";

type Props = {
    postId: number;
    onClose: () => void;
    handleDeletePost?: (postId: number) => void; 
};

const DeletePostBtn = ({ postId, onClose, handleDeletePost }: Props) => {
    const handleClick = () => {
        NiceModal.show(ConfirmModal, {
            title: "Delete post?",
            description: "This action can’t be undone.",
            confirmText: "Delete",
            cancelText: "Cancel",
            variant: "danger",

            onConfirm: async () => {
                await Axios.delete(`/posts/${postId}`);
            },

            onSuccess: () => {
                handleDeletePost?.(postId); 
                onClose(); 
            },
        });
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className="
        inline-flex items-center justify-center
        rounded-xl px-4 py-2 text-sm font-semibold
        transition active:scale-95

        bg-red-100 text-red-700 ring-1 ring-red-200
        hover:bg-red-200 hover:text-red-800

        dark:bg-red-500/15 dark:text-red-200 dark:ring-red-500/25
        dark:hover:bg-red-500/25 dark:hover:text-red-100
      "
        >
            Delete
        </button>
    );
};

export default DeletePostBtn;
