const HeartIcon = ({ isLiked, onClick, className, filled}: { isLiked?: boolean; onClick?: () => void, className?: string, filled: boolean}) => {
    return (
        <>
            {filled ? (
                <svg
                    aria-label="Notifications"
                    fill="currentColor"
                    height="24"
                    role="img"
                    viewBox="0 0 24 24"
                    width="24"
                    className={`${className} cursor-pointer duration-150 hover:scale-110 ${
                        isLiked
                            ? "fill-red-600 stroke-red-600"
                            : "dark:fill-white fill-black dark:stroke-white stroke-black"
                    }`}
                >
                    <title>Notifications</title>
                    <path d="M17.075 1.987a5.852 5.852 0 0 0-5.07 2.66l-.008.012-.01-.014a5.878 5.878 0 0 0-5.062-2.658A6.719 6.719 0 0 0 .5 8.952c0 3.514 2.581 5.757 5.077 7.927.302.262.607.527.91.797l1.089.973c2.112 1.89 3.149 2.813 3.642 3.133a1.438 1.438 0 0 0 1.564 0c.472-.306 1.334-1.07 3.755-3.234l.978-.874c.314-.28.631-.555.945-.827 2.478-2.15 5.04-4.372 5.04-7.895a6.719 6.719 0 0 0-6.425-6.965Z"></path>
                </svg>
            ) : (
                <svg
                    onClick={onClick}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className={`${className} cursor-pointer duration-150 hover:scale-110 ${
                        isLiked
                            ? "fill-red-600 stroke-red-600"
                            : "fill-none stroke-black dark:stroke-white"
                    }`}
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            )}
        </>
    );
}
export default HeartIcon;