const ArrowDownIcon = ({ className } : { className?: string }) => {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={`${className}`}>
            <path
                d="M7 10l5 5 5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default ArrowDownIcon;