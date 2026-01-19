import express from "express";
import init from "./post.provider.js";
import { upload } from "../../lib/upload.js";

export const postRouter = express.Router();

const { postController } = init.controllers;
const { isAuthenticated } = init.middlewares;
const { deletePostValidator, likeValidator, createPostValidator } = init.validators;

postRouter.use(isAuthenticated);

postRouter.post(
    "/",
    [upload.single("postImage"), createPostValidator],
    postController.createNewPost,
);
postRouter.post("/:postId/likes", likeValidator, postController.like);
postRouter.get("/:postId/likes", postController.getAllLikes);
postRouter.get("/:postId", postController.getPostInfo);
postRouter.delete("/:postId", deletePostValidator, postController.deletePost);
