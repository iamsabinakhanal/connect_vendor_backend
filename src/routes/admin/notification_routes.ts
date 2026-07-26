import { Router } from "express";
import { adminNotificationController } from "../../controller/admin/notification_controller";
import { requireAuth, requireRole } from "../../middleware/auth_middleware";
import { Role } from "../../type/domain";

const adminNotificationRouter = Router();

adminNotificationRouter.use(requireAuth, requireRole(Role.ADMIN));
adminNotificationRouter.post("/", (req, res, next) => adminNotificationController.send(req, res, next));

export { adminNotificationRouter };
