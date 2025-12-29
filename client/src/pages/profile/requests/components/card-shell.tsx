import type { ReactNode } from "react";

export default function CardShell({ children }: { children: ReactNode }) {
    return (
        <div className="rounded-2xl bg-white ring-1 ring-slate-200/70 p-4 dark:bg-white/5 dark:ring-white/10">
            {children}
        </div>
    );
}
