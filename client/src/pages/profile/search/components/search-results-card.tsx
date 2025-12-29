import React from "react";

type Props = {
    showResults: boolean;
    query: string;
    hasResults: boolean;
    isLoading?: boolean;
    errorText?: string;
    children?: React.ReactNode;
};

export default function SearchResultsCard({
    showResults,
    query,
    hasResults,
    isLoading = false,
    errorText = "",
    children,
}: Props) {
    const minH = showResults ? "min-h-[120px]" : "min-h-[80px]";

    return (
        <div
            className={`rounded-2xl ring-1 overflow-hidden bg-white ring-slate-200/70 dark:ring-white/10 dark:bg-white/5 ${minH}`}
        >
            {!showResults && (
                <div className="p-6 text-sm text-slate-600 dark:text-slate-400">
                    Start typing to search.
                </div>
            )}

            {showResults && isLoading && (
                <div className="p-6 text-sm text-slate-600 dark:text-slate-400">
                    Loading…
                </div>
            )}

            {showResults && !isLoading && !!errorText && (
                <div className="p-6 text-sm text-slate-600 dark:text-slate-400">
                    {errorText}
                </div>
            )}

            {showResults && !isLoading && !errorText && !hasResults && (
                <div className="p-6 text-sm text-slate-600 dark:text-slate-400">
                    No users match{" "}
                    <span className="text-slate-900 dark:text-slate-200">
                        “{query}”
                    </span>
                    .
                </div>
            )}

            {showResults && !isLoading && !errorText && hasResults && (
                <div className="max-h-80 overflow-y-auto">
                    <div className="divide-y divide-slate-200/70 dark:divide-white/10">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
}
