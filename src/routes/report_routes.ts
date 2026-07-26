import { Router } from "express";
import { reportController } from "../controller/report_controller";
import { requireAuth } from "../middleware/auth_middleware";

const reportRouter = Router();

reportRouter.use(requireAuth);
reportRouter.post("/", (req, res, next) => reportController.create(req, res, next));

export { reportRouter };
