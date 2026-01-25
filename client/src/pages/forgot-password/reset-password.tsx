import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import type { IUser } from "../../types.ts";
import { Axios } from "../../api.ts";
import type { AxiosError } from "axios";
import LockIcon from "../../utils/icons/lock-icon-icon";
import OpenEyeIcon from "../../utils/icons/open-eye-icon";
import CloseEyeIcon from "../../utils/icons/close-eye-icon";

export default function ResetPassword() {
    const [showPw, setShowPw] = useState(false);
    const [errMessage, setErrMessage] = useState("");
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IUser>();

    const handleResetPassword: SubmitHandler<IUser> = ({ password }) => {
        const email = sessionStorage.getItem("email");
        Axios.post("/auth/reset-password", { password, email })
            .then(() => {
                sessionStorage.removeItem("email");
                navigate("/signin");
            })
            .catch((err) => {
                const error = (err as AxiosError).response?.data as {
                    message: string;
                };
                if (error) setErrMessage(error.message);
            });
    };

    return (
        <div className="w-full p-2">
            <div className="mb-8 text-center">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                    New password
                </h1>
                <p className="mt-2 text-sm text-slate-400">
                    Choose a strong password to secure your account.
                </p>
            </div>

            {(errors.password?.message || errMessage) && (
                <div className="mb-4 rounded-xl bg-red-500/10 ring-1 ring-red-500/20 px-4 py-3">
                    {errors.password?.message ? (
                        <p className="text-sm text-red-300">
                            {errors.password.message}
                        </p>
                    ) : null}
                    {errMessage ? (
                        <p className="text-sm text-red-300">{errMessage}</p>
                    ) : null}
                </div>
            )}

            <div className="rounded-2xl bg-black/40 ring-1 ring-white/10 shadow-2xl backdrop-blur-sm">
                <form
                    className="p-6 md:p-8 space-y-5"
                    onSubmit={handleSubmit(handleResetPassword)}
                >
                    <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <LockIcon className="w-5 h-5 stroke-slate-400" />
                        </span>

                        <input
                            id="password"
                            type={showPw ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder="Create a new password"
                            minLength={8}
                            maxLength={18}
                            {...register("password", {
                                required: "Password is required.",
                                minLength: {
                                    value: 8,
                                    message:
                                        "Password must be at least 8 characters.",
                                },
                                maxLength: {
                                    value: 18,
                                    message:
                                        "Password must be at most 18 characters.",
                                },
                                pattern: {
                                    value: /^(?=.*[A-Za-z])(?=.*\d).{8,18}$/,
                                    message:
                                        "Password must include at least one letter and one number.",
                                },
                            })}
                            className="w-full rounded-xl bg-black/20 text-sm ring-1 ring-white/10 placeholder-slate-500 text-slate-100 py-3 pl-10 pr-10 duration-200 focus:outline-none focus:ring-white/40"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPw((s) => !s)}
                            aria-label={
                                showPw ? "Hide password" : "Show password"
                            }
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 active:scale-95 transition"
                        >
                            {showPw ? (
                                <OpenEyeIcon className="w-5 h-5 text-slate-400" />
                            ) : (
                                <CloseEyeIcon className="w-5 h-5 stroke-slate-400" />
                            )}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 font-semibold text-sm duration-200 text-black hover:bg-neutral-200 active:scale-[0.98]"
                    >
                        Update password
                    </button>
                </form>
            </div>
        </div>
    );
}
