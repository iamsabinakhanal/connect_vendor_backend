import { Router } from "express";
import { adminPostController } from "../../controller/admin/post_controller";
import { requireAuth, requireRole } from "../../middleware/auth_middleware";
import { Role } from "../../type/domain";

const adminPostRouter = Router();

adminPostRouter.use(requireAuth, requireRole(Role.ADMIN));
adminPostRouter.get("/", (req, res, next) => adminPostController.list(req, res, next));
adminPostRouter.delete("/:postId", (req, res, next) => adminPostController.delete(req, res, next));

export { adminPostRouter };
