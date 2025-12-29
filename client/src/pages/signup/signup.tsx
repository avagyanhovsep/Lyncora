import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import type { IUser } from "../../types";
import { Axios } from "../../api";
import type { AxiosError } from "axios";
import OpenEyeIcon from "../../utils/icons/open-eye-icon";
import CloseEyeIcon from "../../utils/icons/close-eye-icon";
import EnvelopeIcon from "../../utils/icons/envelope-icon";
import LockIcon from "../../utils/icons/lock-icon-icon";
import Snowfall from "react-snowfall";

const Signup = () => {
    const [showPw, setShowPw] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IUser>();

    const handleSignup: SubmitHandler<IUser> = (user) => {
        Axios.post("/auth/signup", user)
            .then(() => {
                setMessage("");
                navigate("/signin");
            })
            .catch((err) => {
                const error = (err as AxiosError).response?.data as {
                    message: string;
                };

                if (error) {
                    setMessage(error.message);
                }
            });
    };

    return (
        <div className="w-full min-h-screen bg-black text-slate-100 flex items-center justify-center p-4">
            <Snowfall
                color="white"
                style={{
                    position: "fixed",
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                    zIndex: 0,
                }}
                snowflakeCount={20}
            />
            <div className="w-full max-w-md flex flex-col">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Sign up for Lyncora
                    </h1>
                </div>

                <div>
                    {errors.firstName && (
                        <p className="text-red-500 m-2">
                            {errors.firstName.message}
                        </p>
                    )}
                    {message && <p className="text-red-500 m-2">{message}</p>}
                </div>

                <div className="rounded-xl bg-transparent ring-1 ring-white/10 shadow-2xl backdrop-blur-sm max-w-md w-full">
                    <form
                        className="p-6 md:p-8"
                        onSubmit={handleSubmit(handleSignup)}
                    >
                        <div className="mt-4">
                            <div className="relative">
                                <input
                                    id="firstname"
                                    type="text"
                                    {...register("firstName", {
                                        required: "First name is required.",
                                        pattern: {
                                            value: /^[A-Za-z]{2,18}$/,
                                            message:
                                                "First name must be 2-18 letters.",
                                        },
                                    })}
                                    placeholder="First Name"
                                    className="w-full rounded-md bg-transparent text-sm ring-1 ring-white/10 placeholder-slate-500 text-slate-100 px-3 py-3 duration-200 focus:ring-white/40"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="relative">
                                <input
                                    id="lastname"
                                    type="text"
                                    {...register("lastName", {
                                        required: "Last name is required.",
                                        pattern: {
                                            value: /^[A-Za-z]{2,18}$/,
                                            message:
                                                "Last name must be 2-18 letters.",
                                        },
                                    })}
                                    placeholder="Last Name"
                                    className="w-full rounded-md bg-transparent text-sm ring-1 ring-white/10 placeholder-slate-500 text-slate-100 px-3 py-3 duration-200 focus:ring-white/40"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="relative">
                                <input
                                    id="username"
                                    type="text"
                                    {...register("username", {
                                        required: "Username is required.",
                                        pattern: {
                                            value: /^[A-Za-z0-9_]{3,18}$/,
                                            message:
                                                "Username must be 3-18 characters and use only letters, numbers, or underscores.",
                                        },
                                    })}
                                    placeholder="Username"
                                    className="w-full rounded-md bg-transparent text-sm ring-1 ring-white/10 placeholder-slate-500 text-slate-100 px-3 py-3 duration-200 focus:ring-white/40"
                                />
                            </div>
                        </div>

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
                                    {...register("email", {
                                        required: "Email is required.",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "Email format is invalid.",
                                        },
                                    })}
                                    className="w-full rounded-md bg-transparent text-sm ring-1 ring-white/10 placeholder-slate-500 text-slate-100 py-3 pl-10 pr-3 duration-200 focus:ring-white/40"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>

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
                                        showPw
                                            ? "Hide password"
                                            : "Show password"
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
                                Continue
                            </button>
                        </div>

                        <p className="mt-6 text-center text-sm text-slate-400">
                            Already have an account? {" "}
                            <Link
                                to="/signin"
                                className="text-blue-500 duration-200 hover:text-blue-300"
                            >
                                Log in
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default Signup;
