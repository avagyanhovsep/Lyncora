import { NavLink, useLocation } from "react-router-dom";
import BarIcon from "../../../utils/icons/bar-icon";
import type { IAccount } from "../../../types";
import { useEffect, useRef, useState } from "react";
import Navigation from "./components/navigation";
import SettingModal from "./components/setting-modal";

const Navbar = ({ account }: { account: IAccount }) => {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const settingsWrapperRef = useRef<HTMLDivElement | null>(null);
    const location = useLocation();

    const collapsed =
        location.pathname.startsWith("/profile/search") ||
        location.pathname.startsWith("/profile/inbox") ||
        location.pathname.startsWith("/profile/requests") ||
        location.pathname.startsWith("/profile/create-new-post");

    const toggleSettings = () => setSettingsOpen(!settingsOpen);
    const closeSettings = () => setSettingsOpen(false);

    useEffect(() => {
        if (!settingsOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (
                settingsWrapperRef.current &&
                !settingsWrapperRef.current.contains(event.target as Node)
            ) {
                setSettingsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [settingsOpen]);

    return (
        <div
            className={`
                fixed bottom-0 left-0 w-full z-50
                md:static
                ${collapsed ? "md:w-[76px]" : "md:w-[76px] xl:w-[260px]"}
                h-[64px] md:h-full
                border-t md:border-t-0 md:border-r border-slate-200/70 dark:border-white/10
                bg-white/85 dark:bg-neutral-900/80 md:bg-transparent
                backdrop-blur-md md:backdrop-blur-0
                transition-all duration-300
            `}
        >
            <div className="h-full w-full flex md:flex-col md:py-6 px-2 md:px-3">
                <div className="hidden md:flex justify-center xl:justify-start px-2">
                    <NavLink
                        to="/profile"
                        className={`relative flex items-center w-[44px] xl:w-full ${
                            collapsed
                                ? "justify-center"
                                : "justify-center xl:justify-start"
                        }`}
                    >
                        <span
                            className={`text-2xl font-bold text-slate-900 dark:text-white ${
                                collapsed ? "xl:inline" : "xl:hidden"
                            } inline`}
                        >
                            L
                        </span>

                        <span
                            className={`space-grotesk ml-3 text-xl font-semibold text-slate-900 dark:text-white ${
                                collapsed ? "xl:hidden" : ""
                            } hidden xl:inline`}
                        >
                            Lyncora
                        </span>
                    </NavLink>
                </div>

                <div className="flex-1 flex items-center md:items-stretch">
                    <Navigation account={account} collapsed={collapsed} />
                </div>

                <div
                    className="hidden md:flex mt-auto pt-2"
                    ref={settingsWrapperRef}
                >
                    <div className="relative w-full">
                        <SettingModal
                            open={settingsOpen}
                            onClose={closeSettings}
                        />
                        <button
                            onClick={toggleSettings}
                            className="w-full active:scale-90 duration-200"
                            type="button"
                        >
                            <span className="flex items-center rounded-xl p-3 w-[50px] xl:w-full transition-all duration-200 hover:bg-slate-100 dark:hover:bg-white/10">
                                <span className="shrink-0 flex items-center justify-center text-slate-900 dark:text-white">
                                    <BarIcon />
                                </span>

                                <span
                                    className={`${
                                        collapsed
                                            ? "hidden"
                                            : "hidden xl:inline"
                                    } ml-4 text-sm whitespace-nowrap text-slate-700 dark:text-gray-100`}
                                >
                                    More
                                </span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
