import { NextFunction, Request, Response } from "express";
import { notificationService } from "../service/notification_service";

class NotificationController {
  public listMine = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const notifications = await notificationService.listForUser(req.context!.userId);
      res.json(notifications);
    } catch (error) {
      next(error);
    }
  };

  public markAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const notification = await notificationService.markAsRead(req.context!.userId, req.params.notificationId);
      res.json(notification);
    } catch (error) {
      next(error);
    }
  };
}

export const notificationController = new NotificationController();
