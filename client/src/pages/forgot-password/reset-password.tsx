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
        <div className="w-full max-w-md">
            <div className="mb-6 text-center">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                    Enter your new password
                </h1>
            </div>

            <div className="">
                {errors && (
                    <p className="text-red-500">{errors.email?.message}</p>
                )}
                {errMessage && <p className="text-red-500">{errMessage}</p>}
            </div>

            <div className="rounded-2xl bg-black ring-1 ring-white/10 shadow-2xl backdrop-blur">
                <form
                    className="p-6 md:p-8 space-y-5"
                    onSubmit={handleSubmit(handleResetPassword)}
                >
                    <div className="mt-4">
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <LockIcon className="w-5 h-5 stroke-slate-400" />
                            </span>

                            <input
                                id="password"
                                type={showPw ? "text" : "password"}
                                autoComplete="new-password"
                                placeholder="Password"
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
                                className="w-full rounded-md bg-transparent text-sm ring-1 ring-white/10 placeholder-slate-500 text-slate-100 py-3 pl-10 pr-10 duration-200 focus:ring-white/40"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPw((s) => !s)}
                                aria-label={
                                    showPw ? "Hide password" : "Show password"
                                }
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                            >
                                {showPw ? (
                                    <OpenEyeIcon className="w-5 h-5 text-slate-400" />
                                ) : (
                                    <CloseEyeIcon className="w-5 h-5 stroke-slate-400" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-white px-4 py-3 font-semibold text-sm duration-200 text-black hover:bg-neutral-200"
                        >
                            Update Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
