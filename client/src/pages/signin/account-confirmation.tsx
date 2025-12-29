import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Axios } from "../../api";
import type { AxiosError } from "axios";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { IUser } from "../../types";
import OtpInput from "react-otp-input";

const AccountConfirmation = () => {
    const [errMessage, setErrMessage] = useState("");
    const [otp, setOtp] = useState("");

    const navigate = useNavigate();

    const {
        handleSubmit,
        formState: { errors },
    } = useForm<IUser>();

    const handleSigninVerification: SubmitHandler<IUser> = () => {
        if (otp.length !== 6) {
            setErrMessage("Please enter all 6 digits.");
            return;
        }

        const email = sessionStorage.getItem("email");

        Axios.post("/auth/verify", { otp, email })
            .then(() => {
                sessionStorage.removeItem("email");
                navigate("/profile");
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
                    Enter the code
                </h1>
                <p className="mt-2 text-sm text-slate-400">
                    Please check your email, we sent you a code
                </p>
            </div>

            <div>
                {errors && (
                    <p className="text-red-500">{errors.email?.message}</p>
                )}
                {errMessage && <p className="text-red-500">{errMessage}</p>}
            </div>

            <div className="rounded-2xl bg-black ring-1 ring-white/10 shadow-2xl backdrop-blur">
                <form
                    className="p-6 md:p-8 space-y-5"
                    onSubmit={handleSubmit(handleSigninVerification)}
                >
                    <div className="w-full mx-auto">
                        <OtpInput
                            value={otp}
                            onChange={(v) => {
                                const next = v.replace(/\D/g, "").slice(0, 6);
                                setOtp(next);
                                setErrMessage("");
                            }}
                            numInputs={6}
                            shouldAutoFocus
                            inputType="tel"
                            containerStyle="flex gap-5"
                            renderInput={(props) => (
                                <input
                                    {...props}
                                    className="flex-1 h-14 text-center text-2xl rounded-lg bg-transparent ring-1 ring-white/10 focus:ring-1 focus:ring-white/40 focus:outline-none text-slate-100"
                                />
                            )}
                        />
                    </div>

                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-white px-4 py-3 font-semibold text-sm duration-200 text-black hover:bg-neutral-200"
                        >
                            Verify
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AccountConfirmation;
