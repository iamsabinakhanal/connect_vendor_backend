import { randomUUID } from "crypto";
import { CategoryModel, CommunityModel, MessageModel, MongoCommunity, PostModel, UserModel } from "../../database/mongo_models";
import { AppError } from "../../errors/app_error";
import { Community } from "../../models/community";
import { CommunityVisibility, Role } from "../../type/domain";

interface CreateCommunityInput {
  name: string;
  description?: string;
  categoryId: string;
  visibility: CommunityVisibility;
}

interface UpdateCommunityInput {
  name?: string;
  description?: string;
  categoryId?: string;
  visibility?: CommunityVisibility;
}

class CommunityService {
  public async list(): Promise<Community[]> {
    const communities = (await CommunityModel.find().lean()) as MongoCommunity[];
    return communities.map((item) => ({
      id: item._id,
      name: item.name,
      description: item.description,
      categoryId: item.categoryId,
      visibility: item.visibility,
      createdBy: item.createdBy,
      memberIds: item.memberIds,
      createdAt: item.createdAt
    }));
  }

  public async getById(communityId: string): Promise<Community> {
    const community = (await CommunityModel.findById(communityId).lean()) as MongoCommunity | null;
    if (!community) {
      throw new AppError("Community not found", 404);
    }
    return {
      id: community._id,
      name: community.name,
      description: community.description ?? undefined,
      categoryId: community.categoryId,
      visibility: community.visibility,
      createdBy: community.createdBy,
      memberIds: community.memberIds,
      createdAt: community.createdAt
    };
  }

  public async create(adminId: string, payload: CreateCommunityInput): Promise<Community> {
    const creator = await UserModel.findById(adminId).lean();
    if (!creator || creator.role !== Role.ADMIN) {
      throw new AppError("Only admin can create communities", 403);
    }

    const categoryExists = await CategoryModel.exists({ _id: payload.categoryId });
    if (!categoryExists) {
      throw new AppError("Category not found", 404);
    }

    const community = await CommunityModel.create({
      _id: randomUUID(),
      name: payload.name,
      description: payload.description,
      categoryId: payload.categoryId,
      visibility: payload.visibility,
      createdBy: adminId,
      memberIds: [adminId],
      createdAt: new Date()
    });

    await UserModel.updateOne({ _id: adminId }, { $addToSet: { communityIds: community._id } });

    return {
      id: community._id,
      name: community.name,
      description: community.description ?? undefined,
      categoryId: community.categoryId,
      visibility: community.visibility,
      createdBy: community.createdBy,
      memberIds: community.memberIds,
      createdAt: community.createdAt
    };
  }

  public async update(communityId: string, payload: UpdateCommunityInput): Promise<Community> {

    if (payload.categoryId) {
      const categoryExists = await CategoryModel.exists({ _id: payload.categoryId });
      if (!categoryExists) {
        throw new AppError("Category not found", 404);
      }
    }

    const community = (await CommunityModel.findByIdAndUpdate(communityId, payload, { new: true }).lean()) as MongoCommunity | null;
    if (!community) {
      throw new AppError("Community not found", 404);
    }

    return {
      id: community._id,
      name: community.name,
      description: community.description,
      categoryId: community.categoryId,
      visibility: community.visibility,
      createdBy: community.createdBy,
      memberIds: community.memberIds,
      createdAt: community.createdAt
    };
  }

  public async delete(communityId: string): Promise<void> {
    const deleted = (await CommunityModel.findByIdAndDelete(communityId).lean()) as MongoCommunity | null;
    if (!deleted) {
      throw new AppError("Community not found", 404);
    }

    await UserModel.updateMany({}, { $pull: { communityIds: communityId } });
    await PostModel.deleteMany({ communityId });
    await MessageModel.deleteMany({ communityId });
  }

  public async join(userId: string, communityId: string): Promise<Community> {
    const user = await UserModel.findById(userId).lean();
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const community = await this.getById(communityId);

    if (community.visibility === CommunityVisibility.PRIVATE) {
      throw new AppError("Cannot self-join private community; ask admin", 403);
    }

    await this.addMemberToCommunity(user._id, community.id);
    return this.getById(communityId);
  }

  public async addMember(adminId: string, userId: string, communityId: string): Promise<Community> {
    const admin = await UserModel.findById(adminId).lean();
    if (!admin || admin.role !== Role.ADMIN) {
      throw new AppError("Only admin can add users to private communities", 403);
    }

    const user = await UserModel.findById(userId).lean();
    if (!user) {
      throw new AppError("User not found", 404);
    }

    await this.addMemberToCommunity(user._id, communityId);
    return this.getById(communityId);
  }

  private async addMemberToCommunity(userId: string, communityId: string): Promise<void> {
    const user = await UserModel.findById(userId).lean();

    if (!user) {
      throw new AppError("User not found", 404);
    }

    await CommunityModel.updateOne({ _id: communityId }, { $addToSet: { memberIds: userId } });
    await UserModel.updateOne({ _id: userId }, { $addToSet: { communityIds: communityId } });
  }
}

export const communityService = new CommunityService();
