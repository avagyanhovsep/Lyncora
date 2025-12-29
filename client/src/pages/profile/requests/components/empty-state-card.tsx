type Props = {
    title: string;
    subtitle?: string;
};

export default function EmptyStateCard({ title, subtitle }: Props) {
    return (
        <div className="rounded-xl bg-slate-50 ring-1 ring-slate-200/70 p-10 text-center dark:bg-black/20 dark:ring-white/10">
            <p className="text-sm text-slate-700 dark:text-gray-200">{title}</p>
            {subtitle && (
                <p className="mt-1 text-xs text-slate-500 dark:text-gray-500">
                    {subtitle}
                </p>
            )}
        </div>
    );
}
