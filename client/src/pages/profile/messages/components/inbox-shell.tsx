type Props = {
    showChat: boolean;
    sidebar: React.ReactNode;
    main: React.ReactNode;
};

export default function InboxShell({ showChat, sidebar, main }: Props) {
    return (
        <div className="h-screen w-full overflow-hidden md:flex text-slate-900 dark:text-white">
            <aside
                className={`
                    h-full border-r border-slate-200/70 dark:border-white/10 overflow-y-auto flex-col
                    lg:flex lg:flex-[0_0_25%]
                    ${showChat ? "hidden md:block" : "block"}
                `}
            >
                {sidebar}
            </aside>

            <main
                className={`
                    h-full flex flex-col flex-1
                    lg:flex lg:flex-[0_0_75%]
                    ${showChat ? "flex" : "hidden md:flex"}
                `}
            >
                {main}
            </main>
        </div>
    );
}
