import "./index.css";
import Signup from "./pages/signup/signup.tsx";
import Signin from "./pages/signin/signin.tsx";
import ResetPassword from "./pages/forgot-password/reset-password.tsx";
import ForgotPasswordLayout from "./pages/forgot-password/index.tsx";
import Email from "./pages/forgot-password/email.tsx";
import Verify from "./pages/forgot-password/verify.tsx";
import AccountConfirmation from "./pages/signin/account-confirmation.tsx";
import SigninLayout from "./pages/signin/index.tsx";
import NiceModal from "@ebay/nice-modal-react";
import UserProfile from "./pages/profile/user-profile/index.tsx";
import Search from "./pages/profile/search/index.tsx";
import Account from "./pages/profile/index.tsx";
import HomeLayout from "./pages/profile/layout.tsx";
import Settings from "./pages/profile/settings/index.tsx";
import CreateNewPost from "./pages/profile/create-post/index.tsx";
import Followers from "./pages/profile/followers/index.tsx";
import Followings from "./pages/profile/followings/index.tsx";
import Requests from "./pages/profile/requests/index.tsx";
import Messages from "./pages/profile/messages/messages.tsx";
import EditProfile from "./pages/profile/edit-profile/index.tsx";
import { SocketProvider } from "./socket/socket-provider.tsx";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "",
        element: <Signup />,
    },
    {
        path: "signin",
        element: <SigninLayout />,
        children: [
            { path: "", element: <Signin /> },
            { path: "confirm-your-account", element: <AccountConfirmation /> },
        ],
    },
    {
        path: "forgot-password",
        element: <ForgotPasswordLayout />,
        children: [
            { path: "", element: <Email /> },
            { path: "verify-code", element: <Verify /> },
            { path: "reset", element: <ResetPassword /> },
        ],
    },
    {
        path: "profile",
        element: <HomeLayout />,
        children: [
            { path: "", element: <Account /> },
            { path: ":username", element: <UserProfile /> },
            { path: "search", element: <Search /> },
            { path: "inbox", element: <Messages /> },
            { path: "settings", element: <Settings /> },
            { path: "requests", element: <Requests /> },
            { path: "create-new-post", element: <CreateNewPost /> },
            { path: "edit", element: <EditProfile /> },
            { path: ":username/followers", element: <Followers /> },
            { path: ":username/followings", element: <Followings /> },
        ],
    },
]);

createRoot(document.getElementById("root")!).render(
    <SocketProvider>
        <NiceModal.Provider>
            <RouterProvider router={router} />
        </NiceModal.Provider>
    </SocketProvider>
);
