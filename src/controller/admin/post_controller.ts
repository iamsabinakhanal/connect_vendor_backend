import { NextFunction, Request, Response } from "express";
import { postService } from "../../service/post_service";

class AdminPostController {
  public list = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(await postService.list());
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await postService.adminDelete(req.params.postId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export const adminPostController = new AdminPostController();
