import express from 'express';
import init from './follow.provider.js';

export const followRouter = express.Router();

const { followController } = init.controllers;
const { isAuthenticated } = init.middlewares;
const { acceptRequestValidator, declineRequestValidator, followValidator } = init.validators;

followRouter.use(isAuthenticated);

followRouter.get(
    '/requests',
    followController.getRequests
);
followRouter.post(
    "/followings",
    followController.getFollowings
);
followRouter.post(
    "/followers",
    followController.getFollowers
);
followRouter.patch(
    "/requests/:id/accept",
    acceptRequestValidator,
    followController.acceptRequest
);
followRouter.patch(
    "/requests/:id/decline",
    declineRequestValidator,
    followController.declineRequest
);
followRouter.post(
    "/:id",
    followValidator,
    followController.follow
);