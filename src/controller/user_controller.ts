import { NextFunction, Request, Response } from "express";
import { userService } from "../service/user_service";

class UserController {
  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await userService.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };

  public list = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(await userService.list());
    } catch (error) {
      next(error);
    }
  };

  public me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await userService.getById(req.context!.userId);
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  public uploadMyPhoto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({
          message: "Missing photo file. Send multipart/form-data with field name 'photo'"
        });
        return;
      }

      const photoPath = `/uploads/users/${req.file.filename}`;
      const user = await userService.updatePhoto(req.context!.userId, photoPath);

      res.json({
        message: "Photo uploaded",
        user
      });
    } catch (error) {
      next(error);
    }
  };
}

export const userController = new UserController();
