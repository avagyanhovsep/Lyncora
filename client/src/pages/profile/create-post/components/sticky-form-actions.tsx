type StickyFormActionsProps = {
    leftText: string;
    onReset: () => void;
    disableReset?: boolean;
    canSubmit: boolean;
    submitText?: string;
};

const StickyFormActions = ({
    leftText,
    onReset,
    disableReset,
    canSubmit,
    submitText = "Publish",
}: StickyFormActionsProps) => {
    return (
        <div className="sticky bottom-[calc(64px+12px)] md:bottom-4">
            <div
                className="rounded-2xl bg-white/85 backdrop-blur ring-1 ring-slate-200/70 px-4 py-3 flex flex-wrap items-center justify-between gap-3
dark:bg-black/60 dark:ring-white/10"
            >
                <div className="text-xs text-slate-600 dark:text-gray-400">
                    {leftText}
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={onReset}
                        type="button"
                        className="rounded-md border border-slate-200/70 bg-slate-50 px-6 py-2 text-sm text-slate-700 hover:bg-slate-100 active:scale-90 duration-200
dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10"
                        disabled={disableReset}
                    >
                        Reset
                    </button>

                    <button
                        type="submit"
                        disabled={!canSubmit}
                        className={`rounded-md px-6 py-2 text-sm font-medium shadow-lg duration-200 active:scale-90
${
    canSubmit
        ? "text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500"
        : "bg-slate-100 text-slate-400 ring-1 ring-slate-200/70 cursor-not-allowed dark:bg-white/10 dark:text-gray-400 dark:ring-white/10"
}`}
                    >
                        {submitText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StickyFormActions;
