import { NextFunction, Request, Response } from "express";
import { categoryService } from "../../service/admin/category_service";

class AdminCategoryController {
  public list = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(await categoryService.list());
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const category = await categoryService.create(req.body);
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const category = await categoryService.update(req.params.categoryId, req.body);
      res.json(category);
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await categoryService.delete(req.params.categoryId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export const adminCategoryController = new AdminCategoryController();
