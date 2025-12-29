type Props = {
    title: string;
    subtitle: string;
    badgeText: string;
};

export default function PageHeaderWithBadge({
    title,
    subtitle,
    badgeText,
}: Props) {
    return (
        <div className="mb-6 flex items-end justify-between gap-4">
            <div>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                    {title}
                </h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">
                    {subtitle}
                </p>
            </div>

            <span className="rounded-full bg-slate-100 ring-1 ring-slate-200/70 px-3 py-1 text-sm text-slate-700 dark:bg-white/10 dark:ring-white/10 dark:text-gray-200">
                {badgeText}
            </span>
        </div>
    );
}
