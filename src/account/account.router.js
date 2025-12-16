import express from 'express';
import init from './account.provider.js';
import { upload } from '../../lib/upload.js';

const { accountController } = init.controllers;
const { isAuthenticated } = init.middlewares;
const { accountChangeEmailValidator, accountChangePasswordValidator } = init.validators;

export const accountRouter = express.Router();

accountRouter.use(isAuthenticated);

accountRouter.patch(
    "/privacy",
    accountController.setAccountPrivacy
); 
accountRouter.patch(
    "/settings/email",
    accountChangeEmailValidator,
    accountController.changeUserEmail
);
accountRouter.patch(
    "/settings/password",
    [
        accountChangePasswordValidator
    ],
    accountController.changeUserPassword
);
accountRouter.patch(
    "/avatar",
    upload.single("profile-pic"),
    accountController.handleAvatarUpload
);
accountRouter.get(
    "/search/:text",
    accountController.searchUsers
);
accountRouter.get(
    '/:username',
    accountController.getUserInfo
);
