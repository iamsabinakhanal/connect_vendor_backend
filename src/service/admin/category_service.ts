import { randomUUID } from "crypto";
import { CategoryModel, CommunityModel, MongoCategory } from "../../database/mongo_models";
import { AppError } from "../../errors/app_error";
import { Category } from "../../models/category";

interface CreateCategoryInput {
  name: string;
  description?: string;
}

interface UpdateCategoryInput {
  name?: string;
  description?: string;
}

class CategoryService {
  public async list(): Promise<Category[]> {
    const categories = (await CategoryModel.find().lean()) as MongoCategory[];
    return categories.map((item) => ({
      id: item._id,
      name: item.name,
      description: item.description,
      createdAt: item.createdAt
    }));
  }

  public async getById(categoryId: string): Promise<Category> {
    const category = (await CategoryModel.findById(categoryId).lean()) as MongoCategory | null;
    if (!category) {
      throw new AppError("Category not found", 404);
    }
    return {
      id: category._id,
      name: category.name,
      description: category.description ?? undefined,
      createdAt: category.createdAt
    };
  }

  public async create(payload: CreateCategoryInput): Promise<Category> {
    const exists = await CategoryModel.exists({ name: new RegExp(`^${payload.name}$`, "i") });
    if (exists) {
      throw new AppError("Category already exists", 409);
    }

    const category = await CategoryModel.create({
      _id: randomUUID(),
      name: payload.name,
      description: payload.description,
      createdAt: new Date()
    });

    return {
      id: category._id,
      name: category.name,
      description: category.description ?? undefined,
      createdAt: category.createdAt
    };
  }

  public async update(categoryId: string, payload: UpdateCategoryInput): Promise<Category> {
    const category = (await CategoryModel.findByIdAndUpdate(categoryId, payload, { new: true }).lean()) as MongoCategory | null;
    if (!category) {
      throw new AppError("Category not found", 404);
    }

    return {
      id: category._id,
      name: category.name,
      description: category.description,
      createdAt: category.createdAt
    };
  }

  public async delete(categoryId: string): Promise<void> {
    const deleted = await CategoryModel.findByIdAndDelete(categoryId).lean();
    if (!deleted) {
      throw new AppError("Category not found", 404);
    }

    const inUse = await CommunityModel.exists({ categoryId });
    if (inUse) {
      throw new AppError("Cannot delete category used by community", 400);
    }
  }
}

export const categoryService = new CategoryService();
