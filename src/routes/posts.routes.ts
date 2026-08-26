import { Router } from "express";

import * as postsController from "../controllers/posts.controller";

const router = Router();

router.get("/", postsController.getPosts);
router.get("/:id", postsController.getPostById);
router.post("/", postsController.createNewPost);
router.post("/:id/like", postsController.likePostById);
export default router;
