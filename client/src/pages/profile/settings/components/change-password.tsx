import { useForm, type SubmitHandler } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { Axios } from "../../../../api";
import LockIcon from "../../../../utils/icons/lock-icon-icon";
import OpenEyeIcon from "../../../../utils/icons/open-eye-icon";
import CloseEyeIcon from "../../../../utils/icons/close-eye-icon";

interface IChangePasswordForm {
    currentPasswordForPassword: string;
    newPassword: string;
}

type ApiError = { message?: string };

const ChangePassword = () => {
    const [showCurrentPw, setShowCurrentPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);
    const [errMessage, setErrMessage] = useState("");
    const [message, setMessage] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<IChangePasswordForm>();

    const changePassword: SubmitHandler<IChangePasswordForm> = async (data) => {
        try {
            const response = await Axios.patch(
                "/account/settings/password",
                data
            );
            setErrMessage("");
            setMessage(
                (response.data as { message?: string })?.message ?? "Updated."
            );
            reset();
        } catch (e: unknown) {
            setMessage("");
            if (axios.isAxiosError<ApiError>(e)) {
                setErrMessage(
                    e.response?.data?.message ?? "Password update failed."
                );
            } else {
                setErrMessage("Password update failed.");
            }
        }
    };

    return (
        <div className="rounded-2xl bg-white ring-1 ring-slate-200/70 p-5 dark:bg-black/20 dark:ring-white/10">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Change Password
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-gray-500">
                Use a strong password you don’t reuse.
            </p>

            {(errMessage || message || errors.newPassword?.message) && (
                <p
                    className={`mt-3 text-sm ${
                        errMessage || errors.newPassword?.message
                            ? "text-red-600 dark:text-red-400"
                            : "text-emerald-600 dark:text-emerald-400"
                    }`}
                >
                    {errMessage || message || errors.newPassword?.message}
                </p>
            )}

            <form
                className="mt-4 space-y-4"
                onSubmit={handleSubmit(changePassword)}
            >
                <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <LockIcon className="w-5 h-5 stroke-slate-400" />
                    </span>

                    <input
                        id="currentPasswordForPassword"
                        type={showCurrentPw ? "text" : "password"}
                        {...register("currentPasswordForPassword", {
                            required: true,
                        })}
                        className="w-full rounded-xl bg-slate-50 text-sm ring-1 ring-slate-200/70 placeholder-slate-400 text-slate-900 py-3 pl-10 pr-10 duration-200 focus:ring-slate-300 outline-none
                                   dark:bg-transparent dark:ring-white/10 dark:placeholder-slate-500 dark:text-slate-100 dark:focus:ring-white/40"
                        placeholder="Current Password"
                        autoComplete="current-password"
                    />

                    <button
                        type="button"
                        onClick={() => setShowCurrentPw((prev) => !prev)}
                        aria-label={
                            showCurrentPw ? "Hide password" : "Show password"
                        }
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                        {showCurrentPw ? (
                            <OpenEyeIcon className="w-5 h-5 stroke-slate-400" />
                        ) : (
                            <CloseEyeIcon className="w-5 h-5 stroke-slate-400" />
                        )}
                    </button>
                </div>

                <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <LockIcon className="w-5 h-5 stroke-slate-400" />
                    </span>

                    <input
                        id="newPassword"
                        type={showNewPw ? "text" : "password"}
                        {...register("newPassword", {
                            required: "New password is required.",
                            minLength: {
                                value: 8,
                                message: "Minimum 8 characters.",
                            },
                            maxLength: {
                                value: 18,
                                message: "Maximum 18 characters.",
                            },
                        })}
                        className="w-full rounded-xl bg-slate-50 text-sm ring-1 ring-slate-200/70 placeholder-slate-400 text-slate-900 py-3 pl-10 pr-10 duration-200 focus:ring-slate-300 outline-none
                                   dark:bg-transparent dark:ring-white/10 dark:placeholder-slate-500 dark:text-slate-100 dark:focus:ring-white/40"
                        placeholder="New Password"
                        autoComplete="new-password"
                    />

                    <button
                        type="button"
                        onClick={() => setShowNewPw((s) => !s)}
                        aria-label={
                            showNewPw ? "Hide password" : "Show password"
                        }
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                        {showNewPw ? (
                            <OpenEyeIcon className="w-5 h-5 stroke-slate-400" />
                        ) : (
                            <CloseEyeIcon className="w-5 h-5 stroke-slate-400" />
                        )}
                    </button>
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
                    Update Password
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;
