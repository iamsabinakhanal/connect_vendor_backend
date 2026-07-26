import { NextFunction, Request, Response } from "express";
import { reportService } from "../service/report_service";

class ReportController {
  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const report = await reportService.create(req.context!.userId, req.body);
      res.status(201).json(report);
    } catch (error) {
      next(error);
    }
  };
}

export const reportController = new ReportController();
