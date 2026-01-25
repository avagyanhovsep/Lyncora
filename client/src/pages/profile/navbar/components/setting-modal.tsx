import { NavLink, useNavigate } from "react-router-dom";
import NiceModal from "@ebay/nice-modal-react";
import SettingsIcon from "../../../../utils/icons/settings-icon";
import ConfirmModal from "../../components/confirm-modal";

interface SettingModalProps {
    open: boolean;
    onClose: () => void;
}

const SettingModal = ({ open, onClose }: SettingModalProps) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        NiceModal.show(ConfirmModal, {
            title: "Log out?",
            description:
                "Signing out will remove this account from the device.",
            confirmText: "Log out",
            cancelText: "Cancel",
            variant: "danger",
            onConfirm: async () => {
                sessionStorage.removeItem("token");
                navigate("/");
                onClose();
            },
        });
    };

    return (
        <div
            className={`
                absolute left-2 bottom-full mb-3
                z-50 p-2 rounded-2xl
                bg-[#0b1013] backdrop-blur
                ring-1 ring-white/10 shadow-2xl
                transition-all duration-200
                ${
                    open
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 translate-y-2 pointer-events-none"
                }
            `}
        >
            <ul className="w-[220px] flex flex-col gap-1">
                <NavLink to="/profile/settings" onClick={onClose}>
                    <li
                        className="w-full p-3 flex items-center rounded-xl
                   text-white dark:text-slate-100
                   hover:bg-white/10
                   active:scale-95 duration-200"
                    >
                        <span className="shrink-0">
                            <SettingsIcon className="w-5 h-5" />
                        </span>
                        <span className="ml-3 text-sm">Settings</span>
                    </li>
                </NavLink>

                <button
                    onClick={handleLogout}
                    className="w-full p-3 flex items-center rounded-xl text-red-400 hover:bg-white/10 active:scale-95 duration-200"
                    type="button"
                >
                    <span className="text-sm">Log out</span>
                </button>
            </ul>
        </div>
    );
};

export default SettingModal;
