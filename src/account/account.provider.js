import models from '../../config/database/index.js';
import accountChangeEmailValidator from "./validators/account-change-email.validator.js";
import accountChangePasswordValidator from "./validators/account-change-password.validator.js";
import bcrypt from "bcrypt";
import { AccountController } from './account.controller.js';
import { AccountService } from './account.service.js';
import { isAuthenticated } from '../../middlewares/authentication.js';
import { Op } from "sequelize";
import { SAFE_USER } from "../../lib/attributes.js";
import { BcryptService } from './bcrypt.service.js';

const bcryptService = new BcryptService(bcrypt);
const accountService = new AccountService(models.User, models.Follow, bcryptService, Op, SAFE_USER);
const accountController = new AccountController(accountService);

const loader = {};

loader.models = {
    User: models.User,
    Follow: models.Follow
}

loader.services = {
    accountService,
    bcryptService,
};

loader.controllers = {
    accountController
}

loader.middlewares = {
    isAuthenticated: isAuthenticated.bind(null, loader.services.accountService)
}

loader.validators = {
    accountChangeEmailValidator: accountChangeEmailValidator.bind(
        null,
        accountService
    ),
    accountChangePasswordValidator: accountChangePasswordValidator.bind(null, accountService)
};

export default loader;