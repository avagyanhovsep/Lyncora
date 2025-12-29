import { Link } from "react-router-dom";

export default function InboxToolbar() {
    return (
        <div className="w-full px-5 py-2 hidden lg:flex justify-between items-center">
            <h1 className="text-md font-bold text-slate-900 dark:text-white">
                Messages
            </h1>

            <Link to="/profile/requests">
                <span className="text-sm text-slate-600 dark:text-slate-400 font-semibold hover:underline">
                    Requests
                </span>
            </Link>
        </div>
    );
}
