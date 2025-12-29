const OpenEyeIcon = ({ className }: { className?: string }) => {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className={`${className} cursor-pointer`}
        >
            <path
                d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12Z"
                stroke="currentColor"
                strokeWidth="1"
            />
            <circle
                cx="12"
                cy="12"
                r="3"
                stroke="currentColor"
                strokeWidth="1"
            />
        </svg>
    );
};
export default OpenEyeIcon;
