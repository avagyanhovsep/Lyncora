import { useMemo, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import type { IUser } from "../../types";
import type { AxiosError } from "axios";
import { Axios } from "../../api";
import OtpInput from "react-otp-input";

export default function Verify() {
    const [errMessage, setErrMessage] = useState("");
    const [otp, setOtp] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const email = useMemo(() => sessionStorage.getItem("email") ?? "", []);

    const {
        handleSubmit,
        formState: { errors },
    } = useForm<IUser>();

    const handleVerification: SubmitHandler<IUser> = async () => {
        setErrMessage("");

        if (otp.length !== 6) {
            setErrMessage("Please enter all 6 digits.");
            return;
        }

        if (!email) {
            setErrMessage(
                "Email is missing. Please restart the verification flow.",
            );
            return;
        }

        try {
            setIsSubmitting(true);
            await Axios.post("/auth/verify", { otp, email });
            navigate("/forgot-password/reset");
        } catch (err) {
            const error = (err as AxiosError).response?.data as {
                message?: string;
            };
            setErrMessage(
                error?.message || "Verification failed. Please try again.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className={`min-h-[70vh] w-full flex items-center justify-center px-4`}
        >
            <div className={`w-full max-w-md`}>
                <div className={`mb-6 text-center`}>
                    <div
                        className={`mx-auto mb-3 h-12 w-12 rounded-2xl ring-1 ring-white/10 bg-white/5 flex items-center justify-center`}
                    >
                        <span className={`text-lg font-semibold text-white`}>
                            OTP
                        </span>
                    </div>

                    <h1
                        className={`text-3xl md:text-4xl font-bold tracking-tight text-white`}
                    >
                        Enter the code
                    </h1>

                    <p className={`mt-2 text-sm text-slate-400`}>
                        We sent a 6-digit code to{" "}
                        <span className={`text-slate-200`}>
                            {email || "your email"}
                        </span>
                    </p>
                </div>

                <div
                    className={`rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.03] ring-1 ring-white/10 shadow-2xl`}
                >
                    <form
                        className={`p-6 md:p-8`}
                        onSubmit={handleSubmit(handleVerification)}
                    >
                        {(errors?.email?.message || errMessage) && (
                            <div
                                className={`mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3`}
                            >
                                <div className={`flex gap-3`}>
                                    <div
                                        className={`mt-0.5 h-5 w-5 rounded-full bg-red-500/20 ring-1 ring-red-500/30`}
                                    />
                                    <div className={`text-sm text-red-200`}>
                                        {errors?.email?.message || errMessage}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className={`space-y-2`}>
                            <div
                                className={`flex items-center justify-between`}
                            >
                                <label
                                    className={`text-sm font-medium text-slate-200`}
                                >
                                    Verification code
                                </label>
                                <span className={`text-xs text-slate-400`}>
                                    {otp.length}/6
                                </span>
                            </div>

                            <OtpInput
                                value={otp}
                                onChange={(v) => {
                                    const next = v
                                        .replace(/\D/g, "")
                                        .slice(0, 6);
                                    setOtp(next);
                                    setErrMessage("");
                                }}
                                numInputs={6}
                                shouldAutoFocus
                                inputType="tel"
                                containerStyle={`
                                    grid grid-cols-3 sm:grid-cols-6
                                    gap-3 sm:gap-3
                                    w-full max-w-[360px] sm:max-w-none
                                    mx-auto
                                `}
                                renderInput={(props) => {
                                    const { className, ...rest } = props;
                                    return (
                                        <div
                                            className={`
                                                w-full aspect-square
                                                min-h-[52px] sm:min-h-[54px]
                                            `}
                                        >
                                            <input
                                                {...rest}
                                                style={{}}
                                                disabled={isSubmitting}
                                                className={`
                                                    w-full h-full
                                                    text-center text-2xl sm:text-2xl font-semibold
                                                    text-white bg-black/20
                                                    rounded-2xl
                                                    ring-1 ring-white/10
                                                    shadow-inner shadow-black/30
                                                    transition
                                                    focus:outline-none focus:ring-2 focus:ring-white/35
                                                    disabled:opacity-60 disabled:cursor-not-allowed
                                                    ${className ?? ""}
                                                `}
                                            />
                                        </div>
                                    );
                                }}
                            />

                            <p className={`text-xs text-slate-400 text-center`}>
                                Didn’t get it? Check spam/junk or try resending.
                            </p>
                        </div>

                        <div className={`mt-6 space-y-3`}>
                            <button
                                type="submit"
                                disabled={otp.length !== 6 || isSubmitting}
                                className={`
                                    w-full inline-flex items-center justify-center gap-2 rounded-xl
                                    px-4 py-3 font-semibold text-sm
                                    bg-white text-black
                                    transition active:scale-[0.99]
                                    hover:bg-neutral-200
                                    disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-white
                                `}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span
                                            className={`h-4 w-4 rounded-full border-2 border-black/20 border-t-black animate-spin`}
                                        />
                                        Verifying…
                                    </>
                                ) : (
                                    "Verify"
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <p className={`mt-5 text-center text-xs text-slate-500`}>
                    Code expires soon. If you keep failing, request a new one.
                </p>
            </div>
        </div>
    );
}
