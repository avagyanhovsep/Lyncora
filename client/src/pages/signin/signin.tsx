import { Link, useNavigate } from "react-router-dom";
import type { IUser } from "../../types";
import { Axios } from "../../api";
import type { AxiosError } from "axios";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import EnvelopeIcon from "../../utils/icons/envelope-icon";
import LockIcon from "../../utils/icons/lock-icon-icon";
import OpenEyeIcon from "../../utils/icons/open-eye-icon";
import CloseEyeIcon from "../../utils/icons/close-eye-icon";

const Signin = () => {
    const [showPw, setShowPw] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IUser>();

    const handleSigin: SubmitHandler<IUser> = (user: IUser) => {
        Axios.post<{ token: string; endpoint: string }>("/auth/signin", user)
            .then((response) => {
                setMessage("");
                if (response.data.endpoint !== "/profile") {
                    sessionStorage.setItem("email", user.email);
                }
                sessionStorage.setItem("token", response.data.token);
                navigate(response.data.endpoint);
            })
            .catch((err) => {
                const error = (err as AxiosError).response?.data as {
                    message: string;
                };

                if (error) setMessage(error.message);
            });
    };

    return (
        <div className="z-30">
            {/* Header */}
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold tracking-tight">
                    Sign in to Lincora
                </h1>
            </div>

            <div>
                {errors && (
                    <p className="text-red-500">{errors.email?.message}</p>
                )}
                {message && <p className="text-red-500">{message}</p>}
            </div>

            {/* Card */}
            <div className="rounded-2xl bg-transparent ring-1 ring-white/10 shadow-2xl backdrop-blur-sm">
                <form
                    className="p-6 md:p-8 space-y-5"
                    onSubmit={handleSubmit(handleSigin)}
                >
                    {/* Email */}
                    <div className="mt-4">
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <EnvelopeIcon className="w-5 h-5 stroke-slate-400" />
                            </span>

                            <input
                                id="email"
                                type="email"
                                inputMode="email"
                                autoComplete="email"
                                placeholder="Email"
                                {...register("email")}
                                className="w-full rounded-md bg-transparent text-sm ring-1 ring-white/10 placeholder-slate-500 text-slate-100 py-3 pl-10 pr-3 duration-200 focus:ring-white/40"
                            />
                        </div>
                    </div>

                    {/* Password */}
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
                                {...register("password")}
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

                    {/* Forgot password */}
                    <div className="flex justify-end text-sm">
                        <Link
                            to="/forgot-password"
                            className="text-blue-500 duration-200 hover:text-blue-300"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    {/* Submit */}
                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-white px-4 py-3 font-semibold text-sm duration-300 text-black hover:bg-neutral-200 active:scale-90"
                        >
                            Sign in
                        </button>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-sm text-slate-400">
                        Don’t have an account?{" "}
                        <Link
                            to="/"
                            className="text-blue-500 duration-200 hover:text-blue-300"
                        >
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};
export default Signin;
