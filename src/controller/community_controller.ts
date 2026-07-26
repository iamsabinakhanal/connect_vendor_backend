import { NextFunction, Request, Response } from "express";
import { communityService } from "../service/admin/community_service";

class CommunityController {
  public list = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(await communityService.list());
    } catch (error) {
      next(error);
    }
  };

  public join = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const community = await communityService.join(req.context!.userId, req.params.communityId);
      res.json(community);
    } catch (error) {
      next(error);
    }
  };
}

export const communityController = new CommunityController();
