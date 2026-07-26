import { NextFunction, Request, Response } from "express";
import { notificationService } from "../../service/notification_service";

class AdminNotificationController {
  public send = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const notification = await notificationService.send(req.body);
      res.status(201).json(notification);
    } catch (error) {
      next(error);
    }
  };
}

export const adminNotificationController = new AdminNotificationController();
