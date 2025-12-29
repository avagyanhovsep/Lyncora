import { Link } from "react-router-dom";
import type { IAccount } from "../../../../types";
import Image from "../../components/image";
import ArrowDownIcon from "../../../../utils/icons/arrow-down-icon";

export default function SearchUserRow({ user }: { user: IAccount }) {
    return (
        <Link to={`/profile/${user.username}`} className="block">
            <div className="group flex items-center gap-3 px-4 py-3 hover:bg-slate-50 duration-200 dark:hover:bg-white/5">
                <div className="shrink-0">
                    <div className="w-11 h-11 rounded-full overflow-hidden ring-1 ring-slate-200/70 dark:ring-white/10">
                        {user.avatar ? (
                            <Image
                                src={user.avatar}
                                alt="avatar"
                                className="w-11 h-11 object-cover"
                            />
                        ) : (
                            <img
                                src="/assets/default.jpeg"
                                alt="avatar"
                                className="w-11 h-11 object-cover"
                            />
                        )}
                    </div>
                </div>

                <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-900 group-hover:text-slate-950 dark:text-slate-100 dark:group-hover:text-white">
                        {user.firstName} {user.lastName}
                    </p>
                    <p className="truncate text-sm text-slate-600 dark:text-slate-400">
                        @{user.username}
                    </p>
                </div>

                <div className="shrink-0 text-slate-400 group-hover:text-slate-600 duration-200 dark:text-slate-500 dark:group-hover:text-slate-300">
                    <ArrowDownIcon className="-rotate-90 w-5 h-5"/>
                </div>
            </div>
        </Link>
    );
}
