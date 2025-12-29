type PageHeaderProps = {
    title: string;
    subtitle?: string;
};

const PageHeader = ({ title, subtitle }: PageHeaderProps) => {
    return (
        <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                {title}
            </h1>
            {subtitle ? (
                <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">
                    {subtitle}
                </p>
            ) : null}
        </div>
    );
};

export default PageHeader;
