import React from "react";

export default function ProfileHeaderCard({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-full rounded-2xl bg-white ring-1 ring-slate-200/70 overflow-hidden dark:bg-white/5 dark:ring-white/10">
            <div className="p-6 md:p-8">{children}</div>
            <div className="h-px w-full bg-slate-200/70 dark:bg-white/10" />
        </div>
    );
}
