import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useCallback, useState } from "react";
import React from "react";
import { isAxiosError } from "axios";
import { Axios } from "../../../../api";
import UnsendIcon from "../../../../utils/icons/unsend-icon";

type OverlayProps = {
    onClose: () => void;
    children: React.ReactNode;
};

const MessageActionsModal = NiceModal.create(
    ({
        chatId,
        messageId,
        Overlay,
    }: {
        chatId: number;
        messageId: number;
        Overlay: (props: OverlayProps) => React.JSX.Element;
    }) => {
        const modal = useModal();
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState("");

        const close = useCallback(() => {
            modal.hide();
            modal.remove();
        }, [modal]);

        const onUnsend = useCallback(async () => {
            setLoading(true);
            setError("");

            try {
                await Axios.delete(`/chats/${chatId}/messages/${messageId}`);
                modal.resolve(true);
                close();
            } catch (err: unknown) {
                const serverMessage =
                    isAxiosError(err) &&
                    typeof err.response?.data?.message === "string"
                        ? err.response.data.message
                        : "";
                setError(serverMessage || "Failed to unsend message.");
            } finally {
                setLoading(false);
            }
        }, [chatId, messageId, modal, close]);

        if (!modal.visible) return null;

        return (
            <Overlay onClose={close}>
                <div className="relative w-full max-w-xs rounded-2xl bg-white p-3 ring-1 ring-slate-200/70 shadow-xl dark:bg-[#0b1013] dark:ring-white/10">
                    <div className="px-2 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                        Message options
                    </div>

                    {error ? (
                        <div className="mx-2 mb-2 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700 ring-1 ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/20">
                            {error}
                        </div>
                    ) : null}

                    <button
                        type="button"
                        onClick={onUnsend}
                        disabled={loading}
                        className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-red-600 hover:bg-slate-100 active:scale-[0.99] transition disabled:opacity-60 dark:text-red-400 dark:hover:bg-white/10"
                    >
                        <UnsendIcon />
                        {loading ? "Unsending..." : "Unsend"}
                    </button>

                    <button
                        type="button"
                        onClick={close}
                        disabled={loading}
                        className="mt-1 w-full rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10 disabled:opacity-60"
                    >
                        Cancel
                    </button>
                </div>
            </Overlay>
        );
    }
);

export default MessageActionsModal;
