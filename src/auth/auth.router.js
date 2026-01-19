import express from "express";
import init from "./auth.provider.js";

export const authRouter = express.Router();

const { authController } = init.controllers;
const { isAuthenticated } = init.middlewares;
const { signupPipe } = init.pipes;

const {
    signupValidator,
    signinValidator,
    verifyValidator,
    forgotPasswordValidator,
    resetPasswordValidator,
} = init.validators;

authRouter.post(
    "/signup",
    [signupValidator, signupPipe],
    authController.signup,
);
authRouter.post("/signin", signinValidator, authController.signin);
authRouter.post("/verify", verifyValidator, authController.verify);
authRouter.post(
    "/forgot-password",
    forgotPasswordValidator,
    authController.forgotPassword,
);
authRouter.post(
    "/reset-password",
    resetPasswordValidator,
    authController.resetPassword,
);

authRouter.get("/user", isAuthenticated, authController.getUser);
