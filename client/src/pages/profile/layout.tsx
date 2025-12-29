import { useEffect, useRef, useState } from "react";
import type { IAccount } from "../../types";
import { Outlet, useNavigate } from "react-router-dom";
import { Axios } from "../../api";
import Navbar from "./navbar";
import { applyTheme, listenSystemThemeChanges } from "../../utils/theme";

type ThemeMode = "system" | "light" | "dark";

const HomeLayout = () => {
    const [account, setAccount] = useState<IAccount | null>(null);
    const navigate = useNavigate();

    const systemCleanupRef = useRef<null | (() => void)>(null);

    useEffect(() => {
        Axios.get<{ user: IAccount }>("/auth/user")
            .then((response) => {
                setAccount(response.data.user);
            })
            .catch(() => {
                navigate("/signin");
            });
    }, [navigate]);

    useEffect(() => {
        if (!account) return;

        const theme = (account.theme ?? "system") as ThemeMode;

        if (systemCleanupRef.current) {
            systemCleanupRef.current();
            systemCleanupRef.current = null;
        }

        applyTheme(theme);

        if (theme === "system") {
            systemCleanupRef.current = listenSystemThemeChanges("system");
        }

        return () => {
            if (systemCleanupRef.current) {
                systemCleanupRef.current();
                systemCleanupRef.current = null;
            }
        };
    }, [account?.theme, account]);

    return (
        account && (
            <div className="w-full h-screen flex flex-col-reverse md:flex-row bg-white text-slate-900 dark:bg-[#0b1013] dark:text-gray-100">
                <div className="w-full md:w-fit h-fit md:h-full shrink-0 fixed md:static bottom-0 border-r-[1] border-slate-200/70 dark:border-white/10 z-50">
                    <Navbar account={account} />
                </div>

                <div className="flex-1 h-full overflow-y-auto">
                    <div className="w-full min-h-full flex justify-center">
                        <Outlet context={{ account, setAccount }} />
                    </div>
                </div>
            </div>
        )
    );
};

export default HomeLayout;
