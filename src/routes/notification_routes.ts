import { Router } from "express";
import { notificationController } from "../controller/notification_controller";
import { requireAuth } from "../middleware/auth_middleware";

const notificationRouter = Router();

notificationRouter.use(requireAuth);
notificationRouter.get("/", (req, res, next) => notificationController.listMine(req, res, next));
notificationRouter.patch("/:notificationId/read", (req, res, next) => notificationController.markAsRead(req, res, next));

export { notificationRouter };
