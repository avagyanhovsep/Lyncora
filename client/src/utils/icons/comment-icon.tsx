const CommentIcon = ({ className, filled }: { className?: string; filled: boolean }) => {
    return (
        <>
            {filled ? (
                <svg
                    viewBox="0 0 24 24"
                    fill="#ffffff"
                    xmlns="http://www.w3.org/2000/svg"
                    transform="rotate(270)"
                    className={`${className}`}
                >
                    <g id="SVGRepo_bgCarrier" strokeWidth="1"></g>
                    <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                        <g clipPath="url(#clip0_429_11233)">
                            <path
                                d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 13.4876 3.36093 14.891 4 16.1272L3 21L7.8728 20C9.10904 20.6391 10.5124 21 12 21Z"
                                stroke="#ffffff"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>
                        </g>
                        <defs>
                            <clipPath id="clip0_429_11233">
                                <rect
                                    width="24"
                                    height="24"
                                    fill="white"
                                ></rect>
                            </clipPath>
                        </defs>
                    </g>
                </svg>
            ) : (
                <svg
                    aria-label="Comment"
                    className={`${className} cursor-pointer duration-150 hover:scale-105`}
                    fill="currentColor"
                    height="22"
                    role="img"
                    viewBox="0 0 24 24"
                    width="22"
                >
                    <title>Comment</title>
                    <path
                        d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
                        fill="none"
                        stroke="currentColor"
                        strokeLinejoin="round"
                        strokeWidth="2"
                    ></path>
                </svg>
            )}
        </>
    );
};
export default CommentIcon