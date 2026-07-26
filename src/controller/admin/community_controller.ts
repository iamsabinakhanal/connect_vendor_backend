import { NextFunction, Request, Response } from "express";
import { communityService } from "../../service/admin/community_service";

class AdminCommunityController {
  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.context!.userId;
      const community = await communityService.create(userId, req.body);
      res.status(201).json(community);
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const community = await communityService.update(req.params.communityId, req.body);
      res.json(community);
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await communityService.delete(req.params.communityId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  public addMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const adminId = req.context!.userId;
      const { userId } = req.body;
      const community = await communityService.addMember(adminId, userId, req.params.communityId);
      res.json(community);
    } catch (error) {
      next(error);
    }
  };
}

export const adminCommunityController = new AdminCommunityController();
