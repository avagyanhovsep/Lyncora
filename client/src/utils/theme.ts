export type ThemeMode = "system" | "light" | "dark";

const STORAGE_KEY = "theme"; 

export function getStoredTheme(): ThemeMode {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
    return "system";
}

export function setStoredTheme(mode: ThemeMode) {
    localStorage.setItem(STORAGE_KEY, mode);
}

export function applyTheme(mode: ThemeMode) {
    const root = document.documentElement;

    const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;

    const resolved =
        mode === "system" ? (prefersDark ? "dark" : "light") : mode;

    root.classList.remove("dark");
    if (resolved === "dark") root.classList.add("dark");
}

export function listenSystemThemeChanges(mode: ThemeMode) {
    if (!window.matchMedia) return () => {};
    if (mode !== "system") return () => {};

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");

    if (mql.addEventListener) mql.addEventListener("change", handler);
    else mql.addListener(handler);

    return () => {
        if (mql.removeEventListener) mql.removeEventListener("change", handler);
        else mql.removeListener(handler);
    };
}
