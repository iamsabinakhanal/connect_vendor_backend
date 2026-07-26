import { Router } from "express";
import { adminReportController } from "../../controller/admin/report_controller";
import { requireAuth, requireRole } from "../../middleware/auth_middleware";
import { Role, ReportStatus } from "../../type/domain";

const adminReportRouter = Router();

adminReportRouter.use(requireAuth, requireRole(Role.ADMIN));
adminReportRouter.get("/", (req, res, next) => adminReportController.list(req, res, next));
adminReportRouter.patch("/:reportId/status", (req, res, next) => {
  req.body.status = req.body.status as ReportStatus;
  adminReportController.updateStatus(req, res, next);
});

export { adminReportRouter };
