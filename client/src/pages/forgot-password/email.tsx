import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import type { IUser } from "../../types";
import { Axios } from "../../api";
import type { AxiosError } from "axios";
import EnvelopeIcon from "../../utils/icons/envelope-icon";

export default function Email() {
    const [errMessage, setErrMessage] = useState("");
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IUser>();

    const handleForgotPasword: SubmitHandler<IUser> = (user) => {
        Axios.post("/auth/forgot-password", user)
            .then(() => {
                sessionStorage.setItem("email", user.email);
                navigate("verify-code");
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
                <h1 className="text-3xl font-bold tracking-tight">
                    Enter your email
                </h1>
                <p className="mt-2 text-sm text-slate-400">
                    We’ll send you a 6-digit code to reset your password.
                </p>
            </div>

            {(errors.email?.message || errMessage) && (
                <div className="mb-4 rounded-xl bg-red-500/10 ring-1 ring-red-500/20 px-4 py-3">
                    {errors.email?.message ? (
                        <p className="text-sm text-red-300">
                            {errors.email.message}
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
                    onSubmit={handleSubmit(handleForgotPasword)}
                >
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

                    <button
                        type="submit"
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 font-semibold text-sm duration-200 text-black hover:bg-neutral-200 active:scale-[0.98]"
                    >
                        Send the code
                    </button>
                </form>
            </div>
        </div>
    );
}
