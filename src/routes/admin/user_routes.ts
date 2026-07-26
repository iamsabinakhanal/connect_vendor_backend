import { Router } from "express";
import { adminUserController } from "../../controller/admin/user_controller";
import { requireAuth, requireRole } from "../../middleware/auth_middleware";
import { Role } from "../../type/domain";

const adminUserRouter = Router();

adminUserRouter.use(requireAuth, requireRole(Role.ADMIN));
adminUserRouter.get("/", (req, res, next) => adminUserController.list(req, res, next));
adminUserRouter.get("/:userId", (req, res, next) => adminUserController.getById(req, res, next));
adminUserRouter.post("/", (req, res, next) => adminUserController.create(req, res, next));
adminUserRouter.patch("/:userId", (req, res, next) => adminUserController.update(req, res, next));
adminUserRouter.delete("/:userId", (req, res, next) => adminUserController.delete(req, res, next));

export { adminUserRouter };
