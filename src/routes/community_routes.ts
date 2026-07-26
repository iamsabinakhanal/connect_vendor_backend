import { Router } from "express";
import { communityController } from "../controller/community_controller";
import { requireAuth } from "../middleware/auth_middleware";

const communityRouter = Router();

communityRouter.get("/", (req, res, next) => communityController.list(req, res, next));
communityRouter.post("/:communityId/join", requireAuth, (req, res, next) => communityController.join(req, res, next));

export { communityRouter };
