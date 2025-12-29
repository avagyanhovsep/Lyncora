import type { ReactNode } from "react";

type MediaUploaderProps = {
    errorText?: string;
    onPickFile: () => void;
    previewUrl?: string;
    input: ReactNode; 
};

const MediaUploader = ({
    errorText,
    onPickFile,
    previewUrl,
    input,
}: MediaUploaderProps) => {
    return (
        <>
            {errorText ? (
                <p className="mb-3 text-sm text-red-600 dark:text-red-400">
                    {errorText}
                </p>
            ) : null}

            <div
                className="relative w-full rounded-xl bg-slate-50 ring-1 ring-slate-200/70 p-4 cursor-pointer hover:ring-slate-300 transition
dark:bg-black/20 dark:ring-white/10 dark:hover:ring-white/20"
                onClick={onPickFile}
            >
                {input}

                <div className="flex flex-col items-center justify-center gap-3 text-center py-6">
                    <div className="rounded-full bg-indigo-600/10 p-3 ring-1 ring-indigo-600/20 dark:bg-indigo-500/15 dark:ring-indigo-400/20">
                        <svg
                            viewBox="0 0 24 24"
                            className="h-6 w-6 text-indigo-600 dark:text-indigo-300"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path d="M12 5a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H6a1 1 0 1 1 0-2h5V6a1 1 0 0 1 1-1Z" />
                        </svg>
                    </div>

                    <div className="text-sm text-slate-700 dark:text-gray-300">
                        <span className="font-medium text-slate-900 dark:text-white">
                            Click to upload
                        </span>{" "}
                        (drag & drop later)
                    </div>

                    <div className="text-xs text-slate-500 dark:text-gray-500">
                        PNG, JPG, WEBP, GIF • up to 15MB
                    </div>

                    <button
                        type="button"
                        className="mt-1 rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white shadow hover:bg-indigo-500 active:scale-90 duration-200"
                        onClick={(e) => {
                            e.stopPropagation();
                            onPickFile();
                        }}
                    >
                        Choose file
                    </button>
                </div>

                {previewUrl ? (
                    <div className="mt-4 rounded-xl ring-1 ring-slate-200/70 overflow-hidden dark:ring-white/10">
                        <img
                            src={previewUrl}
                            alt="Uploaded preview"
                            className="w-full max-h-[320px] object-cover"
                        />
                    </div>
                ) : null}
            </div>
        </>
    );
};

export default MediaUploader;
