import React from "react";

export default function ProfileHeaderCard({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div
            className="
                w-full rounded-3xl overflow-hidden
                ring-1 ring-slate-200/70 bg-white
                shadow-[0_20px_60px_-40px_rgba(0,0,0,0.35)]
                dark:bg-white/[0.04] dark:ring-white/10
            "
        >
            <div className="relative p-6 md:p-8">
                <div
                    className="
                        pointer-events-none absolute inset-0
                        bg-gradient-to-br from-slate-50/80 via-transparent to-slate-100/60
                        dark:from-white/[0.06] dark:via-transparent dark:to-white/[0.02]
                    "
                />
                <div className="relative">{children}</div>
            </div>

            <div className="h-px w-full bg-slate-200/70 dark:bg-white/10" />
        </div>
    );
}
