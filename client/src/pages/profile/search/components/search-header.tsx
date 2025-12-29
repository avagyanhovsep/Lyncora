type Props = {
    title?: string;
    subtitle?: string;
};

export default function SearchHeader({
    title = "Search",
    subtitle = "Find people by name or username.",
}: Props) {
    return (
        <div className="mb-5">
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                {title}
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {subtitle}
            </p>
        </div>
    );
}
