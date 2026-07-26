import { Router } from "express";
import { adminCommunityController } from "../../controller/admin/community_controller";
import { requireAuth, requireRole } from "../../middleware/auth_middleware";
import { Role } from "../../type/domain";

const adminCommunityRouter = Router();

adminCommunityRouter.use(requireAuth, requireRole(Role.ADMIN));
adminCommunityRouter.post("/", (req, res, next) => adminCommunityController.create(req, res, next));
adminCommunityRouter.patch("/:communityId", (req, res, next) => adminCommunityController.update(req, res, next));
adminCommunityRouter.delete("/:communityId", (req, res, next) => adminCommunityController.delete(req, res, next));
adminCommunityRouter.post("/:communityId/members", (req, res, next) => adminCommunityController.addMember(req, res, next));

export { adminCommunityRouter };
