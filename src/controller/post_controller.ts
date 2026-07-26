import { NextFunction, Request, Response } from "express";
import { postService } from "../service/post_service";

class PostController {
  private buildImageUrl = (file?: Express.Multer.File): string | undefined => {
    if (!file) {
      return undefined;
    }

    return `/uploads/posts/${file.filename}`;
  };

  public list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(await postService.list(req.query.communityId as string | undefined));
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const post = await postService.create(req.context!.userId, {
        ...req.body,
        imageUrl: this.buildImageUrl(req.file)
      });
      res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const post = await postService.update(req.context!.userId, req.params.postId, {
        ...req.body,
        imageUrl: this.buildImageUrl(req.file)
      });
      res.json(post);
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await postService.delete(req.context!.userId, req.params.postId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export const postController = new PostController();
