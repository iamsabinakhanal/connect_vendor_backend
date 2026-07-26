import { Router } from "express";
import { userController } from "../controller/user_controller";
import { requireAuth } from "../middleware/auth_middleware";
import { userPhotoUpload } from "../middleware/upload_middleware";

const userRouter = Router();

userRouter.post("/register", (req, res, next) => userController.register(req, res, next));
userRouter.get("/", (req, res, next) => userController.list(req, res, next));
userRouter.get("/me", requireAuth, (req, res, next) => userController.me(req, res, next));
userRouter.post(
	"/me/photo",
	requireAuth,
	userPhotoUpload.single("photo"),
	(req, res, next) => userController.uploadMyPhoto(req, res, next)
);

export { userRouter };
