import { useForm, type SubmitHandler } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import NiceModal from "@ebay/nice-modal-react";
import { Axios } from "../../../../api";
import LockIcon from "../../../../utils/icons/lock-icon-icon";
import OpenEyeIcon from "../../../../utils/icons/open-eye-icon";
import CloseEyeIcon from "../../../../utils/icons/close-eye-icon";
import EnvelopeIcon from "../../../../utils/icons/envelope-icon";
import ConfirmModal from "../../components/confirm-modal";

interface IChangeEmailForm {
    currentPasswordForEmail: string;
    newEmail: string;
}

type ApiError = { message?: string };

const ChangeEmail = () => {
    const [showPw, setShowPw] = useState(false);
    const [errMessage, setErrMessage] = useState("");
    const [message, setMessage] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<IChangeEmailForm>();

    const changeEmailConfirmed = async (user: IChangeEmailForm) => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await Axios.patch("/account/settings/email", {
                ...user,
                token,
            });

            setErrMessage("");
            setMessage(
                (response.data as { message?: string })?.message ?? "Updated.",
            );
            reset();
        } catch (e: unknown) {
            setMessage("");
            if (axios.isAxiosError<ApiError>(e)) {
                setErrMessage(
                    e.response?.data?.message ?? "Email update failed.",
                );
            } else {
                setErrMessage("Email update failed.");
            }
            throw e;
        }
    };

    const onSubmit: SubmitHandler<IChangeEmailForm> = (user) => {
        setErrMessage("");
        setMessage("");

        NiceModal.show(ConfirmModal, {
            title: "Change email?",
            description: "You may need to verify this email after updating.",
            confirmText: "Change email",
            cancelText: "Cancel",
            variant: "default",
            content: (
                <div className="rounded-xl bg-slate-50 ring-1 ring-slate-200/70 p-3 text-xs text-slate-700 dark:bg-white/5 dark:ring-white/10 dark:text-slate-200">
                    New email:{" "}
                    <span className="font-semibold">{user.newEmail}</span>
                </div>
            ),
            onConfirm: async () => {
                await changeEmailConfirmed(user);
            },
        });
    };

    return (
        <div className="rounded-2xl bg-white ring-1 ring-slate-200/70 p-5 dark:bg-black/20 dark:ring-white/10">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Change Email
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-gray-500">
                Confirm your password to update email.
            </p>

            {(errMessage || message || errors.newEmail?.message) && (
                <p
                    className={`mt-3 text-sm ${
                        errMessage || errors.newEmail?.message
                            ? "text-red-600 dark:text-red-400"
                            : "text-emerald-600 dark:text-emerald-400"
                    }`}
                >
                    {errMessage || message || errors.newEmail?.message}
                </p>
            )}

            <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <LockIcon className="w-5 h-5 stroke-slate-400" />
                    </span>

                    <input
                        id="currentPasswordForEmail"
                        type={showPw ? "text" : "password"}
                        {...register("currentPasswordForEmail", {
                            required: true,
                        })}
                        placeholder="Current Password"
                        autoComplete="current-password"
                        className="w-full rounded-xl bg-slate-50 text-sm ring-1 ring-slate-200/70 placeholder-slate-400 text-slate-900 py-3 pl-10 pr-10 duration-200 focus:ring-slate-300 outline-none
                                   dark:bg-transparent dark:ring-white/10 dark:placeholder-slate-500 dark:text-slate-100 dark:focus:ring-white/40"
                    />

                    <button
                        type="button"
                        onClick={() => setShowPw((prev) => !prev)}
                        aria-label={showPw ? "Hide password" : "Show password"}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                        {showPw ? (
                            <OpenEyeIcon className="w-5 h-5 stroke-slate-400" />
                        ) : (
                            <CloseEyeIcon className="w-5 h-5 stroke-slate-400" />
                        )}
                    </button>
                </div>

                <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <EnvelopeIcon className="w-5 h-5 stroke-slate-400" />
                    </span>

                    <input
                        id="newEmail"
                        type="email"
                        {...register("newEmail", {
                            required: "New email is required.",
                            pattern: {
                                value: /^\S+@\S+\.\S+$/,
                                message: "Enter a valid email.",
                            },
                        })}
                        placeholder="New Email"
                        autoComplete="email"
                        className="w-full rounded-xl bg-slate-50 text-sm ring-1 ring-slate-200/70 placeholder-slate-400 text-slate-900 py-3 pl-10 pr-3 duration-200 focus:ring-slate-300 outline-none
                                   dark:bg-transparent dark:ring-white/10 dark:placeholder-slate-500 dark:text-slate-100 dark:focus:ring-white/40"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full rounded-xl px-4 py-2 text-sm font-semibold text-white transition active:scale-95
            ${
                isSubmitting
                    ? "bg-blue-600/50 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-500"
            }`}
                >
                    Update Email
                </button>
            </form>
        </div>
    );
};

export default ChangeEmail;
