import { Link } from "react-router-dom";

export default function InboxSidebarHeader({ username }: { username: string }) {
    return (
        <div className="sticky top-0 z-10 bg-white/85 dark:bg-[#0b1013] backdrop-blur-md p-5 hidden lg:flex">
            <Link
                to="/profile"
                className="inline-flex items-center text-lg font-bold text-slate-900 dark:text-slate-100 transition hover:text-slate-950 dark:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 active:scale-95"
            >
                {username}
            </Link>
        </div>
    );
}
