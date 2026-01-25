import { Outlet } from "react-router-dom";
import Snowfall from "react-snowfall";
import { useEffect } from "react";

const SigninLayout = () => {
    useEffect(() => {
        const prevHtmlOverflow = document.documentElement.style.overflow;
        const prevBodyOverflow = document.body.style.overflow;
        const prevBodyHeight = document.body.style.height;

        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
        document.body.style.height = "100%";

        return () => {
            document.documentElement.style.overflow = prevHtmlOverflow;
            document.body.style.overflow = prevBodyOverflow;
            document.body.style.height = prevBodyHeight;
        };
    }, []);

    return (
        <div className="relative h-dvh w-full bg-black text-slate-100 overflow-hidden">
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

            <div className="relative z-10 h-full w-full flex items-center justify-center p-2">
                <div className="w-full max-w-md max-h-full overflow-auto overscroll-contain">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default SigninLayout;
