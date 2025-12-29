const HomeIcon = ({ className, filled }: { className?: string, filled?: boolean }) => {
    return (
        <>
            {filled ? (
                <svg
                    aria-label="Home"
                    fill="currentColor"
                    className={`${className} cursor-pointer`}
                    height="24"
                    role="img"
                    viewBox="0 0 24 24"
                    width="24"
                >
                    <title>Home</title>
                    <path d="m21.762 8.786-7-6.68a3.994 3.994 0 0 0-5.524 0l-7 6.681A4.017 4.017 0 0 0 1 11.68V19c0 2.206 1.794 4 4 4h3.005a1 1 0 0 0 1-1v-7.003a2.997 2.997 0 0 1 5.994 0V22a1 1 0 0 0 1 1H19c2.206 0 4-1.794 4-4v-7.32a4.02 4.02 0 0 0-1.238-2.894Z"></path>
                </svg>
            ) : (
                <svg
                    aria-label="Home"
                    fill="currentColor"
                    className={`${className} cursor-pointer`}
                    height="24"
                    width="24"
                    viewBox="0 0 24 24"
                    role="img"
                >
                    <title>Home</title>
                    <path d="m21.762 8.786-7-6.68C13.266.68 10.734.68 9.238 2.106l-7 6.681A4.017 4.017 0 0 0 1 11.68V20c0 1.654 1.346 3 3 3h5.005a1 1 0 0 0 1-1L10 15c0-1.103.897-2 2-2 1.09 0 1.98.877 2 1.962L13.999 22a1 1 0 0 0 1 1H20c1.654 0 3-1.346 3-3v-8.32a4.021 4.021 0 0 0-1.238-2.894ZM21 20a1 1 0 0 1-1 1h-4.001L16 15c0-2.206-1.794-4-4-4s-4 1.794-4 4l.005 6H4a1 1 0 0 1-1-1v-8.32c0-.543.226-1.07.62-1.447l7-6.68c.747-.714 2.013-.714 2.76 0l7 6.68c.394.376.62.904.62 1.448V20Z" />
                </svg>
            )}
        </>
    );
};

export default HomeIcon;
