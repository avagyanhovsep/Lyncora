import type { InputHTMLAttributes } from "react";

type TextInputProps = InputHTMLAttributes<HTMLInputElement>;

const TextInput = ({ className = "", ...props }: TextInputProps) => {
    return (
        <input
            {...props}
            className={`w-full rounded-xl bg-white text-sm ring-1 ring-slate-200/70 placeholder-slate-400 text-slate-900 px-4 py-3 duration-200 focus:ring-slate-300 outline-none dark:bg-transparent dark:ring-white/10 dark:placeholder-slate-500 dark:text-slate-100 dark:focus:ring-white/40 ${className}`}
        />
    );
};

export default TextInput;
    