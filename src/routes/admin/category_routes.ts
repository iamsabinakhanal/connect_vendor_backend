import { Router } from "express";
import { adminCategoryController } from "../../controller/admin/category_controller";
import { requireAuth, requireRole } from "../../middleware/auth_middleware";
import { Role } from "../../type/domain";

const adminCategoryRouter = Router();

adminCategoryRouter.use(requireAuth, requireRole(Role.ADMIN));
adminCategoryRouter.get("/", (req, res, next) => adminCategoryController.list(req, res, next));
adminCategoryRouter.post("/", (req, res, next) => adminCategoryController.create(req, res, next));
adminCategoryRouter.patch("/:categoryId", (req, res, next) => adminCategoryController.update(req, res, next));
adminCategoryRouter.delete("/:categoryId", (req, res, next) => adminCategoryController.delete(req, res, next));

export { adminCategoryRouter };
