type Props = {
    variant: "info" | "error";
    children: React.ReactNode;
};

export default function ChatBanner({ variant, children }: Props) {
    if (variant === "info") {
        return (
            <div className="mt-3 rounded-xl bg-slate-100 px-3 py-2 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10">
                {children}
            </div>
        );
    }

    return (
        <div className="mt-2 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700 ring-1 ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/20">
            {children}
        </div>
    );
}
