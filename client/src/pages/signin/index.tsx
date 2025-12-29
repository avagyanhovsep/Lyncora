import { Outlet } from "react-router-dom";
import Snowfall from "react-snowfall";

const SigninLayout = () => {
    return (
        <div className="min-h-screen bg-black text-slate-100 flex items-center justify-center p-4">
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
            <div className="w-full max-w-md">
                <Outlet />
            </div>
        </div>
    );
}
export default SigninLayout;