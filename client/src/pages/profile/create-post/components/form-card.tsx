type FormCardProps = {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
};

const FormCard = ({ title, subtitle, children }: FormCardProps) => {
    return (
        <div className="rounded-2xl bg-white ring-1 ring-slate-200/70 p-5 dark:bg-white/5 dark:ring-white/10">
            <div className="mb-4">
                <h2 className="text-sm font-medium text-slate-900 dark:text-gray-200">
                    {title}
                </h2>
                {subtitle ? (
                    <p className="text-xs text-slate-500 dark:text-gray-500">
                        {subtitle}
                    </p>
                ) : null}
            </div>

            {children}
        </div>
    );
};

export default FormCard;
