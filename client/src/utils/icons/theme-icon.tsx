const ThemeIcon = ({ className } : { className?: string }) => {
    return (
        <svg
            viewBox="0 0 24 24"
            className={`${className}`}
            fill="none"
        >
            <path
                d="M12 3v2m0 14v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M3 12h2m14 0h2M4.22 19.78l1.42-1.42m12.72-12.72 1.42-1.42"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
            <path
                d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z"
                stroke="currentColor"
                strokeWidth="1.8"
            />
        </svg>
    );
}

export default ThemeIcon;