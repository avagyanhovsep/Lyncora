import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useState, type ReactNode } from "react";

export type ConfirmModalProps = {
    title: string;
    description?: string;
    content?: ReactNode;

    confirmText?: string;
    cancelText?: string;

    variant?: "danger" | "default";
    confirmTone?: "solid" | "ghost"; 

    onConfirm: () => Promise<void> | void;
    onSuccess?: () => void;

    closeOnSuccess?: boolean;
};

const ConfirmModal = NiceModal.create((props: ConfirmModalProps) => {
    const modal = useModal();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        title,
        description,
        content,
        confirmText = "Confirm",
        cancelText = "Cancel",
        variant = "default",
        confirmTone = "solid",
        onConfirm,
        onSuccess,
        closeOnSuccess = true,
    } = props;

    const close = () => {
        if (loading) return;
        modal.hide();
    };

    const afterClose = () => modal.remove();

    const handleConfirm = async () => {
        if (loading) return;

        setError(null);
        try {
            setLoading(true);
            await onConfirm();
            onSuccess?.();
            if (closeOnSuccess) modal.hide();
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const solidDanger =
        "bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed";
    const solidDefault =
        "bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed";

    const ghostDanger =
        "text-red-600 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed dark:text-red-300 dark:hover:bg-white/10";
    const ghostDefault =
        "text-slate-900 hover:bg-slate-100 disabled:opacity-60 disabled:cursor-not-allowed dark:text-slate-100 dark:hover:bg-white/10";

    const confirmClass =
        confirmTone === "ghost"
            ? variant === "danger"
                ? ghostDanger
                : ghostDefault
            : variant === "danger"
              ? solidDanger
              : solidDefault;

    return (
        <div
            className={`
        fixed inset-0 z-[999]
        flex items-end justify-center sm:items-center
        bg-black/50 backdrop-blur-[2px]
        transition-opacity duration-200
        ${modal.visible ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
            onClick={close}
            onTransitionEnd={() => {
                if (!modal.visible) afterClose();
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-modal-title"
                onClick={(e) => e.stopPropagation()}
                className={`
          w-full max-w-sm rounded-2xl
          bg-white text-slate-900 ring-1 ring-slate-200/70 shadow-2xl
          p-4 mb-4 sm:mb-0
          transform transition-transform duration-200
          ${modal.visible ? "translate-y-0" : "translate-y-4"}
          dark:bg-neutral-950 dark:text-slate-100 dark:ring-white/10
        `}
            >
                <div className="px-1 pb-3">
                    <p
                        id="confirm-modal-title"
                        className="text-sm font-semibold"
                    >
                        {title}
                    </p>

                    {description ? (
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {description}
                        </p>
                    ) : null}

                    {content ? <div className="mt-3">{content}</div> : null}

                    {error ? (
                        <p className="mt-3 text-xs text-red-600 dark:text-red-400">
                            {error}
                        </p>
                    ) : null}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                        type="button"
                        onClick={close}
                        disabled={loading}
                        className="rounded-xl px-3 py-2 text-sm font-semibold
                       text-slate-700 hover:bg-slate-100
                       disabled:opacity-40 disabled:cursor-not-allowed
                       dark:text-slate-200 dark:hover:bg-white/10"
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={loading}
                        className={`rounded-xl px-3 py-2 text-sm font-semibold ${confirmClass}`}
                    >
                        {loading ? "Please wait..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
});

export default ConfirmModal;
