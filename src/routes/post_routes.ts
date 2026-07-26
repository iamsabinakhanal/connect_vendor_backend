import { Router } from "express";
import { postController } from "../controller/post_controller";
import { requireAuth } from "../middleware/auth_middleware";
import { postImageUpload } from "../middleware/upload_middleware";

const postRouter = Router();

postRouter.get("/", (req, res, next) => postController.list(req, res, next));
postRouter.post("/", requireAuth, postImageUpload.single("image"), (req, res, next) => postController.create(req, res, next));
postRouter.patch("/:postId", requireAuth, postImageUpload.single("image"), (req, res, next) => postController.update(req, res, next));
postRouter.delete("/:postId", requireAuth, (req, res, next) => postController.delete(req, res, next));

export { postRouter };
