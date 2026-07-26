import { NextFunction, Request, Response } from "express";
import { reportService } from "../../service/report_service";

class AdminReportController {
  public list = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(await reportService.list());
    } catch (error) {
      next(error);
    }
  };

  public updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const report = await reportService.updateStatus(req.params.reportId, req.body.status);
      res.json(report);
    } catch (error) {
      next(error);
    }
  };
}

export const adminReportController = new AdminReportController();
