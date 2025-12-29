type FormFieldProps = {
    label: string;
    hint?: string;
    children: React.ReactNode;
};

const FormField = ({ label, hint, children }: FormFieldProps) => {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-gray-300">
                {label}
            </label>

            {children}

            {hint ? (
                <p className="mt-1 text-xs text-slate-500 dark:text-gray-500">
                    {hint}
                </p>
            ) : null}
        </div>
    );
};

export default FormField;
