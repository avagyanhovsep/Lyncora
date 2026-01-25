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
        formState: { errors, isSubmitting },
    } = useForm<IUser>();

    const handleSigin: SubmitHandler<IUser> = (user: IUser) => {
        return Axios.post<{ token: string; endpoint: string }>(
            "/auth/signin",
            user,
        )
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
        <div className="w-full p-2">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold tracking-tight">
                    Sign in to Lyncora
                </h1>
                <p className="mt-2 text-sm text-slate-400">
                    Welcome back. Continue where you left off.
                </p>
            </div>

            {(errors?.email?.message ||
                errors?.password?.message ||
                message) && (
                <div className="mb-4 rounded-xl bg-red-500/10 ring-1 ring-red-500/20 px-4 py-3">
                    {errors?.email?.message ? (
                        <p className="text-sm text-red-300">
                            {errors.email.message}
                        </p>
                    ) : null}
                    {errors?.password?.message ? (
                        <p className="text-sm text-red-300">
                            {errors.password.message}
                        </p>
                    ) : null}
                    {message ? (
                        <p className="text-sm text-red-300">{message}</p>
                    ) : null}
                </div>
            )}

            <div className="rounded-2xl bg-black/40 ring-1 ring-white/10 shadow-2xl backdrop-blur-sm">
                <form
                    className="p-6 md:p-8 space-y-5"
                    onSubmit={handleSubmit(handleSigin)}
                >
                    <div>
                        <label className="mb-2 block text-xs font-semibold text-slate-300">
                            Email
                        </label>
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <EnvelopeIcon className="w-5 h-5 stroke-slate-400" />
                            </span>

                            <input
                                id="email"
                                type="email"
                                inputMode="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                {...register("email")}
                                className="w-full rounded-xl bg-black/20 text-sm ring-1 ring-white/10 placeholder-slate-500 text-slate-100 py-3 pl-10 pr-3 duration-200 focus:outline-none focus:ring-white/40"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-semibold text-slate-300">
                            Password
                        </label>
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <LockIcon className="w-5 h-5 stroke-slate-400" />
                            </span>

                            <input
                                id="password"
                                type={showPw ? "text" : "password"}
                                autoComplete="current-password"
                                placeholder="Your password"
                                {...register("password")}
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
                    </div>

                    <div className="flex justify-end text-sm">
                        <Link
                            to="/forgot-password"
                            className="text-blue-400 duration-200 hover:hover:text-blue-300"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 font-semibold text-sm duration-200 text-black hover:bg-neutral-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Signing in..." : "Sign in"}
                    </button>

                    <p className="text-center text-sm text-slate-400">
                        Don’t have an account?{" "}
                        <Link
                            to="/"
                            className="text-blue-400 duration-200 hover:hover:text-blue-300"
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
