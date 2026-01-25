import { useEffect, useMemo, useRef, useState } from "react";
import type { IAccount } from "../../types";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Axios } from "../../api";
import Navbar from "./navbar";
import { applyTheme, listenSystemThemeChanges } from "../../utils/theme";

type ThemeMode = "system" | "light" | "dark";

const HomeLayout = () => {
    const [account, setAccount] = useState<IAccount | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const systemCleanupRef = useRef<null | (() => void)>(null);

    const collapsed = useMemo(() => {
        const p = location.pathname;
        return (
            p.startsWith("/profile/search") ||
            p.startsWith("/profile/inbox") ||
            p.startsWith("/profile/requests") ||
            p.startsWith("/profile/create-new-post")
        );
    }, [location.pathname]);

    useEffect(() => {
        const prevHtmlOverflow = document.documentElement.style.overflow;
        const prevBodyOverflow = document.body.style.overflow;
        const prevBodyHeight = document.body.style.height;

        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
        document.body.style.height = "100%";

        return () => {
            document.documentElement.style.overflow = prevHtmlOverflow;
            document.body.style.overflow = prevBodyOverflow;
            document.body.style.height = prevBodyHeight;
        };
    }, []);

    useEffect(() => {
        Axios.get<{ user: IAccount }>("/auth/user")
            .then((response) => setAccount(response.data.user))
            .catch(() => navigate("/signin"));
    }, [navigate]);

    useEffect(() => {
        const mode = ((account?.theme ?? "system") as ThemeMode) || "system";

        if (systemCleanupRef.current) {
            systemCleanupRef.current();
            systemCleanupRef.current = null;
        }

        applyTheme(mode);

        if (mode === "system") {
            systemCleanupRef.current = listenSystemThemeChanges(() => {
                applyTheme("system");
            });
        }

        return () => {
            if (systemCleanupRef.current) {
                systemCleanupRef.current();
                systemCleanupRef.current = null;
            }
        };
    }, [account?.theme]);

    if (!account) return null;

    return (
        <div
            className={`
                relative h-dvh w-full overflow-hidden
                bg-white text-slate-900
                dark:bg-[#0b1013] dark:text-gray-100
                pt-[env(safe-area-inset-top)] md:pt-0
                pb-[env(safe-area-inset-bottom)] md:pb-0
            `}
        >
            <div className="relative h-full w-full">
                <div
                    className={`
                        fixed bottom-0 left-0 w-full z-50
                        md:fixed md:inset-y-0 md:left-0 md:w-auto
                    `}
                >
                    <Navbar account={account} />
                </div>

                <div
                    className={`
                        absolute inset-0
                        md:pl-[76px] ${collapsed ? "" : "xl:pl-[260px]"}
                        pb-[calc(64px+env(safe-area-inset-bottom))] md:pb-0
                    `}
                >
                    <div
                        className={`
                            h-full w-full min-h-0
                            overflow-y-auto overscroll-contain
                            [scrollbar-gutter:stable]
                        `}
                    >
                        <div className="min-h-full w-full">
                            <Outlet context={{ account, setAccount }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeLayout;
