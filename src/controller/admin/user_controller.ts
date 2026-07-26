import { NextFunction, Request, Response } from "express";
import { userService } from "../../service/user_service";

class AdminUserController {
	public list = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const users = await userService.listDetailed();
			res.json(users);
		} catch (error) {
			next(error);
		}
	};

	public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const user = await userService.getById(req.params.userId);
			res.json(user);
		} catch (error) {
			next(error);
		}
	};

	public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const user = await userService.createByAdmin(req.body);
			res.status(201).json(user);
		} catch (error) {
			next(error);
		}
	};

	public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const user = await userService.update(req.params.userId, req.body);
			res.json(user);
		} catch (error) {
			next(error);
		}
	};

	public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			await userService.delete(req.params.userId);
			res.status(204).send();
		} catch (error) {
			next(error);
		}
	};
}

export const adminUserController = new AdminUserController();
