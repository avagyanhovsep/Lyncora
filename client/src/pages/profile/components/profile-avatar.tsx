import PencilIcon from "../../../utils/icons/pencil-icon";

type Props = {
    src?: string | null;
    size?: "md" | "lg";
    editable?: boolean;
    onPickFile?: () => void;
};

export default function ProfileAvatar({
    src,
    size = "lg",
    editable = false,
    onPickFile,
}: Props) {
    const box =
        size === "lg"
            ? "w-[120px] h-[120px] md:w-[140px] md:h-[140px]"
            : "w-[112px] h-[112px] sm:w-[132px] sm:h-[132px]";

    return (
        <div className="shrink-0 relative">
            <div
                className={[
                    box,
                    "rounded-full overflow-hidden",
                    "ring-2 ring-white/70 shadow-lg shadow-black/20",
                    "dark:ring-white/10 dark:bg-black/20",
                    "bg-slate-100",
                    editable ? "cursor-pointer" : "",
                    "transition",
                    "md:hover:shadow-xl md:hover:shadow-black/30",
                ].join(" ")}
                onClick={editable ? onPickFile : undefined}
                title={editable ? "Change avatar" : undefined}
            >
                <img
                    src={src ? src : "/assets/default.jpeg"}
                    alt="avatar"
                    className="w-full h-full object-cover"
                />
            </div>

            {editable && (
                <button
                    type="button"
                    onClick={onPickFile}
                    className="
                        absolute bottom-2 right-2 z-10
                        flex items-center justify-center w-9 h-9 rounded-full
                        bg-slate-900/80 backdrop-blur
                        ring-1 ring-black/10 shadow-lg shadow-black/30
                        active:scale-95 transition
                        dark:bg-black/70 dark:ring-white/10
                        md:hover:bg-slate-900 md:dark:hover:bg-black/90
                    "
                    title="Edit avatar"
                >
                    <PencilIcon className="w-4 h-4 stroke-white" />
                </button>
            )}
        </div>
    );
}
