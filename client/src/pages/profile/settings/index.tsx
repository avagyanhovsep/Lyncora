import { useNavigate, useOutletContext } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import NiceModal from "@ebay/nice-modal-react";
import { Axios } from "../../../api";
import { applyTheme, setStoredTheme } from "../../../utils/theme";
import type { IContext } from "../../../types";
import ThemeIcon from "../../../utils/icons/theme-icon";
import ArrowDownIcon from "../../../utils/icons/arrow-down-icon";
import ChangeEmail from "./components/change-email";
import ChangePassword from "./components/change-password";
import PrivacySwitch from "./components/privacy-switch";
import ConfirmModal from "../components/confirm-modal";

type ThemeMode = "system" | "light" | "dark";

const Settings = () => {
    const navigate = useNavigate();
    const { account, setAccount } = useOutletContext<IContext>();

    const [theme, setTheme] = useState<ThemeMode>("system");
    const [savingTheme, setSavingTheme] = useState(false);

    const mountedRef = useRef(true);
    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        const accountTheme = (account?.theme as ThemeMode) ?? "system";
        setTheme(accountTheme);
        applyTheme(accountTheme);
    }, [account?.theme]);

    const cleanupAndRedirectToSignin = useCallback(() => {
        sessionStorage.removeItem("token");
        setAccount(null);
        applyTheme("system");
        navigate("/signin", { replace: true });
    }, [navigate, setAccount]);

    const handleLogout = useCallback(() => {
        NiceModal.show(ConfirmModal, {
            title: "Log out?",
            description:
                "Signing out will remove this account from the device.",
            confirmText: "Log out",
            cancelText: "Cancel",
            variant: "danger",
            onConfirm: async () => {
                cleanupAndRedirectToSignin();
            },
        });
    }, [cleanupAndRedirectToSignin]);

    const onThemeChange = useCallback(
        async (mode: ThemeMode) => {
            if (savingTheme) return;

            const prev = theme;

            setTheme(mode);
            applyTheme(mode);
            setStoredTheme(mode);

            if (!account) return;

            setSavingTheme(true);
            try {
                await Axios.patch("/account/theme", { theme: mode });
                setAccount({ ...account, theme: mode });
            } catch {
                setTheme(prev);
                applyTheme(prev);
                setStoredTheme(prev);
            } finally {
                if (mountedRef.current) setSavingTheme(false);
            }
        },
        [account, savingTheme, theme, setAccount],
    );

    const onDeleteAccount = useCallback(() => {
        NiceModal.show(ConfirmModal, {
            title: "Delete account?",
            description:
                "This permanently deletes your account. This action cannot be undone.",
            confirmText: "Delete",
            cancelText: "Cancel",
            variant: "danger",
            content: (
                <div className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700 ring-1 ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/20">
                    This action is permanent.
                </div>
            ),
            onConfirm: async () => {
                await Axios.delete("/account");
            },
            onSuccess: () => {
                cleanupAndRedirectToSignin();
            },
        });
    }, [cleanupAndRedirectToSignin]);

    return (
        <div className="w-full px-4 sm:px-6 py-10">
            <div className="mx-auto w-full max-w-5xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                        Settings
                    </h1>
                    <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">
                        Manage account security and privacy.
                    </p>
                </div>

                <div className="space-y-6">
                    <section className="rounded-2xl bg-white ring-1 ring-slate-200/70 p-6 dark:bg-white/5 dark:ring-white/10">
                        <div className="mb-5">
                            <h2 className="text-sm font-medium text-slate-900 dark:text-gray-200">
                                Change your information
                            </h2>
                            <p className="mt-1 text-xs text-slate-500 dark:text-gray-500">
                                Update email or password.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <ChangeEmail />
                            <ChangePassword />
                        </div>
                    </section>

                    <section className="rounded-2xl bg-white ring-1 ring-slate-200/70 p-6 dark:bg-white/5 dark:ring-white/10">
                        <div className="mb-5">
                            <h2 className="text-sm font-medium text-slate-900 dark:text-gray-200">
                                Account privacy
                            </h2>
                            <p className="mt-1 text-xs text-slate-500 dark:text-gray-500">
                                Control who can follow you.
                            </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 ring-1 ring-slate-200/70 p-4 dark:bg-black/20 dark:ring-white/10">
                            <PrivacySwitch />
                        </div>
                    </section>

                    <section className="rounded-2xl bg-white/90 ring-1 ring-slate-200/70 p-6 shadow-sm dark:bg-white/5 dark:ring-white/10">
                        <div className="mb-5">
                            <h2 className="text-sm font-semibold text-slate-900 dark:text-gray-200">
                                Appearance
                            </h2>
                            <p className="mt-1 text-xs text-slate-500 dark:text-gray-500">
                                Choose how Lyncora looks for your account.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-gray-300">
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 ring-1 ring-slate-200/70 dark:bg-black/30 dark:ring-white/10">
                                    <ThemeIcon className="h-4 w-4 text-slate-600 dark:text-gray-300" />
                                </span>

                                <div className="leading-tight">
                                    <div className="font-medium text-slate-900 dark:text-gray-200">
                                        Theme
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-gray-500">
                                        {savingTheme
                                            ? "Saving…"
                                            : "System follows your OS setting."}
                                    </div>
                                </div>
                            </div>

                            <div className="w-full sm:w-[320px]">
                                <div className="relative">
                                    <select
                                        value={theme}
                                        disabled={savingTheme}
                                        onChange={(e) =>
                                            onThemeChange(
                                                e.target.value as ThemeMode,
                                            )
                                        }
                                        className="w-full appearance-none rounded-xl px-4 py-3 pr-10 text-sm font-semibold bg-white text-slate-900 ring-1 ring-slate-200/70 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-60 disabled:cursor-not-allowed dark:bg-black/30 dark:text-gray-100 dark:ring-white/10"
                                    >
                                        <option value="system">system</option>
                                        <option value="light">light</option>
                                        <option value="dark">dark</option>
                                    </select>

                                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                                        <ArrowDownIcon />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-2xl bg-white ring-1 ring-red-500/30 p-6 dark:bg-white/5 dark:ring-red-500/20">
                        <div className="mb-4">
                            <h2 className="text-sm font-medium text-red-600 dark:text-red-400">
                                Danger zone
                            </h2>
                            <p className="mt-1 text-xs text-slate-500 dark:text-gray-500">
                                Signing out will remove this account from the
                                device.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center justify-center rounded-xl bg-red-600/90 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-600 active:scale-95 transition"
                            >
                                Log out
                            </button>

                            <button
                                onClick={onDeleteAccount}
                                className="inline-flex items-center justify-center rounded-xl bg-red-600/90 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-600 active:scale-95 transition"
                            >
                                Delete Account
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Settings;
