import { NextFunction, Request, Response } from "express";
import { messageService } from "../service/message_service";

class MessageController {
  public listMine = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const messages = await messageService.listForUser(req.context!.userId);
      res.json(messages);
    } catch (error) {
      next(error);
    }
  };

  public send = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const message = await messageService.send(req.context!.userId, req.body);
      res.status(201).json(message);
    } catch (error) {
      next(error);
    }
  };
}

export const messageController = new MessageController();
