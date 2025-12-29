import { Outlet } from "react-router-dom";

export default function ForgotPasswordLayout() {
    return (
        <div className="min-h-screen bg-black text-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Outlet />
            </div>
        </div>
    );
}
