import { NavLink } from "react-router-dom";
import type { IAccount } from "../../../../types";
import SearchIcon from "../../../../utils/icons/search-icon";
import PlaneIcon from "../../../../utils/icons/plane-icon";
import RequestsIcon from "../../../../utils/icons/requests-icon";
import PlusIcon from "../../../../utils/icons/plus-icon";
import Image from "../../components/image";

const Navigation = ({
    account,
    collapsed,
}: {
    account: IAccount;
    collapsed: boolean;
}) => {
    const navLinks = [
        { id: 1, text: "Search", to: "/profile/search", icon: SearchIcon },
        { id: 3, text: "Messages", to: "/profile/inbox", icon: PlaneIcon },
        {
            id: 4,
            text: "Requests",
            to: "/profile/requests",
            icon: RequestsIcon,
        },
        {
            id: 5,
            text: "Create",
            to: "/profile/create-new-post",
            icon: PlusIcon,
        },
        { id: 6, text: "Profile", to: `/profile`, icon: null },
    ];

    return (
        <ul className="w-full flex items-center justify-around gap-1 md:flex-col md:items-stretch md:justify-start md:gap-1 md:pt-6">
            {navLinks.map((item) => (
                <NavLink
                    key={item.id}
                    to={item.to}
                    end={item.text === "Profile"}
                    className={({ isActive }) =>
                        `group flex items-center justify-center md:justify-start rounded-xl transition-colors duration-200
                        ${
                            isActive
                                ? "bg-slate-200 text-slate-900 dark:bg-white/10 dark:text-white"
                                : "hover:bg-slate-100 text-slate-700 dark:text-gray-100 dark:hover:bg-white/10"
                        }`
                    }
                >
                    {({ isActive }) => (
                        <div className="flex items-center justify-center md:justify-start h-[48px] w-[56px] md:w-full px-0 md:px-3 rounded-xl active:scale-95 transition-transform duration-200">
                            <span
                                className={[
                                    "shrink-0 flex items-center justify-center",
                                    isActive
                                        ? "text-slate-900 dark:text-white"
                                        : "text-slate-600 group-hover:text-slate-900 dark:text-gray-100 dark:group-hover:text-white",
                                ].join(" ")}
                            >
                                {item.icon ? (
                                    <item.icon filled={isActive} />
                                ) : account.avatar ? (
                                    <Image
                                        src={account.avatar}
                                        alt="avatar"
                                        className="w-[26px] h-[26px] rounded-full object-cover ring-1 ring-slate-300 dark:ring-white/10"
                                    />
                                ) : (
                                    <img
                                        src="/assets/default.jpeg"
                                        alt="avatar"
                                        className="w-[26px] h-[26px] rounded-full object-cover ring-1 ring-slate-300 dark:ring-white/10"
                                    />
                                )}
                            </span>

                            <span
                                className={`${
                                    collapsed ? "hidden" : "hidden xl:inline"
                                } ml-4 text-sm whitespace-nowrap text-slate-700 dark:text-gray-100`}
                            >
                                {item.text}
                            </span>
                        </div>
                    )}
                </NavLink>
            ))}
        </ul>
    );
};

export default Navigation;
