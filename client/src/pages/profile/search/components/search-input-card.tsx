import SearchIcon from "../../../../utils/icons/search-icon";

type Props = {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
};

export default function SearchInputCard({
    value,
    onChange,
    placeholder = "Search for friends...",
}: Props) {
    return (
        <div className="rounded-2xl bg-white ring-1 ring-slate-200/70 p-3 dark:bg-white/5 dark:ring-white/10">
            <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 dark:text-slate-400">
                    <SearchIcon className="w-4 h-4"/>
                </span>

                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full rounded-xl bg-slate-50 text-base text-slate-900 placeholder-slate-400 ring-1 ring-slate-200/70 py-3 pl-10 pr-3 duration-200 focus:ring-slate-300 focus:outline-none
                     dark:bg-black/30 dark:text-slate-100 dark:placeholder-slate-500 dark:ring-white/10 dark:focus:ring-white/30"
                />
            </div>
        </div>
    );
}
