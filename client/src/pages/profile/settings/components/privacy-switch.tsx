import { useOutletContext } from "react-router-dom";
import NiceModal from "@ebay/nice-modal-react";
import { Axios } from "../../../../api";
import type { IContext } from "../../../../types";
import ConfirmModal from "../../components/confirm-modal";

const PrivacySwitch = () => {
    const { account, setAccount } = useOutletContext<IContext>();

    const switchPrivacy = () => {
        const nextPrivate = !account.isAccountPrivate;

        NiceModal.show(ConfirmModal, {
            title: nextPrivate
                ? "Make account private?"
                : "Make account public?",
            description: nextPrivate
                ? "Only approved followers can see your posts."
                : "Anyone can see your posts.",
            confirmText: nextPrivate ? "Make private" : "Make public",
            cancelText: "Cancel",
            variant: "default",
            onConfirm: async () => {
                const res = await Axios.patch<{ isAccountPrivate: boolean }>(
                    "/account/privacy",
                );
                setAccount({
                    ...account,
                    isAccountPrivate: res.data.isAccountPrivate,
                });
            },
        });
    };

    return (
        <button
            type="button"
            onClick={switchPrivacy}
            className="flex items-center justify-between w-full select-none rounded-xl px-3 py-2 hover:bg-white/5 transition active:scale-[0.99]"
        >
            <div className="text-left">
                <p className="text-sm dark:text-white text-black font-medium">
                    Private account
                </p>
                <p className="text-xs text-gray-500">
                    Only approved followers can see your posts.
                </p>
            </div>

            <div
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    account.isAccountPrivate ? "bg-blue-600" : "bg-gray-500"
                }`}
                aria-hidden="true"
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        account.isAccountPrivate
                            ? "translate-x-6"
                            : "translate-x-1"
                    }`}
                />
            </div>
        </button>
    );
};

export default PrivacySwitch;
