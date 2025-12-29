const DeletePostBtn = ({
    handleDeletePost,
    onClose,
}: {
    handleDeletePost?: () => void;
    onClose: () => void;
}) => {
    const handleClick = () => {
        if (handleDeletePost) handleDeletePost();
        onClose();
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
