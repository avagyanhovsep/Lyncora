import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useCallback, useState } from "react";
import { isAxiosError } from "axios";
import { Axios } from "../../../../api";
import TrashIcon from "../../../../utils/icons/trash-icon";
import React from "react";

type OverlayProps = {
    onClose: () => void;
    children: React.ReactNode;
};

const DeleteAccountModal = NiceModal.create(
    ({ Overlay }: { Overlay: (props: OverlayProps) => React.JSX.Element }) => {
        const modal = useModal();
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState("");

        const close = useCallback(() => {
            modal.hide();
            modal.remove();
        }, [modal]);

        const onDelete = useCallback(async () => {
            setLoading(true);
            setError("");

            try {
                await Axios.delete("/account");
                modal.resolve(true);
                close();
            } catch (err: unknown) {
                if (isAxiosError(err)) {
                    const data = err.response ? err.response.data : null;
                    const message =
                        data &&
                        typeof (data as { message?: unknown }).message ===
                            "string"
                            ? (data as { message: string }).message
                            : "";
                    setError(message || "Failed to delete account.");
                } else {
                    setError("Failed to delete account.");
                }
            } finally {
                setLoading(false);
            }
        }, [close, modal]);

        if (!modal.visible) return null;

        return (
            <Overlay onClose={close}>
                <div className="relative w-full max-w-sm rounded-2xl bg-white p-5 ring-1 ring-slate-200/70 shadow-xl dark:bg-[#0b1013] dark:ring-white/10">
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        Delete account?
                    </div>
                    <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                        This permanently deletes your account. This action
                        cannot be undone.
                    </div>

                    {error ? (
                        <div className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700 ring-1 ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/20">
                            {error}
                        </div>
                    ) : null}

                    <div className="mt-4 flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={close}
                            disabled={loading}
                            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-60 dark:text-slate-200 dark:hover:bg-white/10"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={onDelete}
                            disabled={loading}
                            className="inline-flex items-center gap-2 rounded-xl bg-red-600/90 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60"
                        >
                            <TrashIcon className="w-4 h-4" />
                            {loading ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </div>
            </Overlay>
        );
    }
);

export default DeleteAccountModal;
