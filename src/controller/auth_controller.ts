import { NextFunction, Request, Response } from "express";
import { userService } from "../service/user_service";

class AuthController {
  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await userService.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await userService.authenticate(req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();