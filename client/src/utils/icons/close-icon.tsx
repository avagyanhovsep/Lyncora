const CloseIcon = ({onClick, className} : {onClick: () => void, className?: string}) => {
    return (
        <svg
            aria-label="Close"
            onClick={onClick}
            className={`${className} cursor-pointer duration-150 hover:scale-105`}
            role="img"
            viewBox="0 0 24 24"
        >
            <title>Close</title>
            <polyline
                fill="none"
                points="20.643 3.357 12 12 3.353 20.647"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
            />
            <line
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                x1="20.649"
                x2="3.354"
                y1="20.649"
                y2="3.354"
            />
        </svg>
    );
}
export default CloseIcon;