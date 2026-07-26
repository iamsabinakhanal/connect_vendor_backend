import { Router } from "express";
import { messageController } from "../controller/message_controller";
import { requireAuth } from "../middleware/auth_middleware";

const messageRouter = Router();

messageRouter.use(requireAuth);
messageRouter.get("/", (req, res, next) => messageController.listMine(req, res, next));
messageRouter.post("/", (req, res, next) => messageController.send(req, res, next));

export { messageRouter };
