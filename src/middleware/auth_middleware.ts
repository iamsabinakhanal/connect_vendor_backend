import { NextFunction, Request, Response } from "express";
import { UserModel } from "../database/mongo_models";
import { AppError } from "../errors/app_error";
import { Role } from "../type/domain";

export const requireAuth = (req: Request, _res: Response, next: NextFunction): void => {
  void (async () => {
    const userId = req.header("x-user-id");

    if (!userId) {
      throw new AppError("Missing x-user-id header", 401);
    }

    const user = await UserModel.findById(userId).lean();
    if (!user) {
      throw new AppError("Invalid user", 401);
    }

    req.context = {
      userId: user._id,
      role: user.role as Role
    };
  })()
    .then(() => next())
    .catch(next);
};

export const requireRole = (role: Role) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.context) {
      next(new AppError("Unauthorized", 401));
      return;
    }

    if (req.context.role !== role) {
      next(new AppError("Forbidden", 403));
      return;
    }

    next();
  };
};
