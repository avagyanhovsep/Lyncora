const TrashIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        className={`${className}`}
        fill="currentColor"
        aria-hidden="true"
    >
        <path d="M9 3a1 1 0 0 0-1 1v1H5a1 1 0 1 0 0 2h1v13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7h1a1 1 0 1 0 0-2h-3V4a1 1 0 0 0-1-1H9Zm1 2h4v0H10ZM8 7h8v13H8V7Zm2 3a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1Zm5 0a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1Z" />
    </svg>
);
export default TrashIcon;