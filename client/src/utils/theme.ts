export type ThemeMode = "system" | "light" | "dark";

const STORAGE_KEY = "theme";

const THEME_COLOR_LIGHT = "#ffffff";
const THEME_COLOR_DARK = "#0b1013";

function getOrCreateThemeMeta() {
    let meta = document.querySelector<HTMLMetaElement>(
        'meta[name="theme-color"]',
    );
    if (!meta) {
        meta = document.createElement("meta");
        meta.name = "theme-color";
        document.head.appendChild(meta);
    }
    return meta;
}

export function getStoredTheme(): ThemeMode {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "light" || v === "dark" || v === "system" ? v : "system";
}

export function setStoredTheme(mode: ThemeMode) {
    localStorage.setItem(STORAGE_KEY, mode);
}

export function resolveTheme(mode: ThemeMode): "light" | "dark" {
    const prefersDark =
        window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
    return mode === "system" ? (prefersDark ? "dark" : "light") : mode;
}

export function applyTheme(mode: ThemeMode) {
    const resolved = resolveTheme(mode);
    const root = document.documentElement;

    root.classList.toggle("dark", resolved === "dark");
    root.style.colorScheme = resolved;

    const meta = getOrCreateThemeMeta();
    meta.setAttribute(
        "content",
        resolved === "dark" ? THEME_COLOR_DARK : THEME_COLOR_LIGHT,
    );
}

export function listenSystemThemeChanges(onChange: () => void) {
    const mql = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mql) return () => {};

    const handler = () => onChange();

    if (mql.addEventListener) mql.addEventListener("change", handler);
    else mql.addListener(handler);

    return () => {
        if (mql.removeEventListener) mql.removeEventListener("change", handler);
        else mql.removeListener(handler);
    };
}
