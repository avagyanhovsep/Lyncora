import express from 'express';
import init from './post.provider.js';
import { upload } from '../../lib/upload.js';

export const postRouter = express.Router();

const { postController } = init.controllers;
const { isAuthenticated } = init.middlewares;
const { deletePostValidator, likeValidator } = init.validators;

postRouter.use(isAuthenticated);

postRouter.post(
    "/",
    postController.createNewPost
);
postRouter.patch(
    "/image",
    upload.single("post-image"),
    postController.uploadPostImage
);

postRouter.get(
    "/:postId",
    postController.getPostInfo
);
postRouter.delete(
    "/:postId",
    deletePostValidator,
    postController.deletePost
);

postRouter.post(
    "/:postId/likes",
    likeValidator,
    postController.like
);
postRouter.get(
    "/:postId/likes",
    postController.getAllLikes
);
