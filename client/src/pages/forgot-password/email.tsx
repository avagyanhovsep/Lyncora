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
        <div className="w-full max-w-md">
            <div className="mb-6 text-center">
                <h1 className="text-3xl font-bold tracking-tight">
                    Enter your email
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
                    onSubmit={handleSubmit(handleForgotPasword)}
                >
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

                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-white px-4 py-3 font-semibold text-sm duration-200 text-black hover:bg-neutral-200"
                        >
                            Send the code
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
