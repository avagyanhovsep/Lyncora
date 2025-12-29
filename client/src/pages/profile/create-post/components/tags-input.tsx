import type { KeyboardEvent } from "react";

type TagsInputProps = {
    tags: string[];
    value: string;
    onChange: (v: string) => void;
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
    onBlurAdd: () => void;
    onRemoveTag: (tag: string) => void;
    maxTags?: number;
};

const TagsInput = ({
    tags,
    value,
    onChange,
    onKeyDown,
    onBlurAdd,
    onRemoveTag,
    maxTags = 10,
}: TagsInputProps) => {
    return (
        <div className="rounded-xl ring-1 ring-slate-200/70 bg-slate-50 p-3 dark:ring-white/10 dark:bg-black/20">
            {tags.length > 0 ? (
                <div className="mb-3 flex flex-wrap items-center gap-2">
                    {tags.map((tag) => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => onRemoveTag(tag)}
                            className="inline-flex items-center gap-1 rounded-md bg-indigo-600/10 py-1 px-2 text-xs text-indigo-700 ring-1 ring-indigo-600/20 hover:bg-indigo-600/15
dark:bg-indigo-500/15 dark:text-indigo-200 dark:ring-indigo-400/20 dark:hover:bg-indigo-500/25"
                            title="Click to remove"
                        >
                            #{tag}
                            <svg
                                viewBox="0 0 20 20"
                                className="h-3.5 w-3.5"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path d="M6.7 6.7a1 1 0 0 1 1.4 0L10 8.6l1.9-1.9a1 1 0 1 1 1.4 1.4L11.4 10l1.9 1.9a1 1 0 1 1-1.4 1.4L10 11.4l-1.9 1.9a1 1 0 1 1-1.4-1.4L8.6 10 6.7 8.1a1 1 0 0 1 0-1.4Z" />
                            </svg>
                        </button>
                    ))}
                </div>
            ) : null}

            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={onKeyDown}
                onBlur={onBlurAdd}
                placeholder="Type and press Enter…"
                className="w-full rounded-xl bg-white text-sm ring-1 ring-slate-200/70 placeholder-slate-400 text-slate-900 px-4 py-3 duration-200 focus:ring-slate-300 outline-none
dark:bg-transparent dark:ring-white/10 dark:placeholder-slate-500 dark:text-slate-100 dark:focus:ring-white/40"
            />

            <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-slate-500 dark:text-gray-500">
                    Up to {maxTags} tags • 24 chars max
                </p>
                <p className="text-xs text-slate-500 dark:text-gray-500">
                    {tags.length}/{maxTags}
                </p>
            </div>
        </div>
    );
};

export default TagsInput;
