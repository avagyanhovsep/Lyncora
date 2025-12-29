type Props = {
    visible: boolean;
    leftText: string;
    showClear: boolean;
    onClear: () => void;
};

export default function SearchResultsToolbar({
    visible,
    leftText,
    showClear,
    onClear,
}: Props) {
    if (!visible) return null;

    return (
        <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-slate-600 dark:text-slate-400">
                {leftText}
            </p>

            {showClear && (
                <button
                    type="button"
                    onClick={onClear}
                    className="text-xs text-slate-600 hover:text-slate-900 duration-200 dark:text-slate-400 dark:hover:text-slate-200"
                >
                    Clear
                </button>
            )}
        </div>
    );
}
