import PlaneIcon from "../../../../utils/icons/plane-icon";

type Props = {
    value: string;
    onChange: (v: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    disabled: boolean;
    placeholder: string;
};

export default function ChatComposer({
    value,
    onChange,
    onSubmit,
    disabled,
    placeholder,
}: Props) {
    return (
        <div className="px-4 py-3">
            <form
                onSubmit={onSubmit}
                className="flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/80 px-3 py-1 backdrop-blur dark:border-white/10 dark:bg-transparent"
            >
                <input
                    disabled={disabled}
                    className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:text-slate-50 dark:placeholder:text-slate-500"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                />

                <button
                    type="submit"
                    disabled={disabled || !value.trim()}
                    className="h-8 w-14 rounded-full bg-indigo-700 transition hover:brightness-110 disabled:bg-slate-200/70 disabled:text-slate-400 dark:disabled:bg-white/10 dark:disabled:text-white/40"
                    title={disabled ? "This conversation is read-only" : "Send"}
                >
                    <span className="flex h-full w-full items-center justify-center">
                        <PlaneIcon className="h-4 w-4 text-white" />
                    </span>
                </button>
            </form>
        </div>
    );
}
