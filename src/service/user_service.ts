import { randomUUID } from "crypto";
import { CommunityModel, UserModel, MongoUser } from "../database/mongo_models";
import { AppError } from "../errors/app_error";
import { User } from "../models/user";
import { Role } from "../type/domain";
import { hashPassword, verifyPassword } from "../utils/password";
import { env } from "../config/env";

interface CreateUserInput {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  password: string;
}

interface AdminCreateUserInput extends Omit<CreateUserInput, "password"> {
  password?: string;
}

interface UpdateUserInput {
  name?: string;
  email?: string;
  phone?: string;
  businessName?: string;
  photoUrl?: string;
  password?: string;
}

interface LoginInput {
  email: string;
  password: string;
}

const toUser = (user: MongoUser): User => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  businessName: user.businessName,
  photoUrl: user.photoUrl
    ? user.photoUrl.startsWith("http")
      ? user.photoUrl
      : `${env.publicBaseUrl}${user.photoUrl}`
    : undefined,
  role: user.role as Role,
  communityIds: user.communityIds,
  createdAt: user.createdAt
});

class UserService {
  public async getById(userId: string): Promise<User> {
    const user = (await UserModel.findById(userId).lean()) as MongoUser | null;
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return toUser(user);
  }

  public async list(): Promise<Array<Pick<User, "id" | "name" | "businessName">>> {
    const users = (await UserModel.find().select("_id name businessName").lean()) as Array<Pick<MongoUser, "_id" | "name" | "businessName">>;
    return users.map((item) => ({
      id: item._id,
      name: item.name,
      businessName: item.businessName
    }));
  }

  public async listDetailed(): Promise<User[]> {
    const users = (await UserModel.find().lean()) as MongoUser[];
    return users.map(toUser);
  }

  public async create(payload: CreateUserInput): Promise<User> {
    const email = payload.email.toLowerCase();
    const exists = await UserModel.exists({ email });
    if (exists) {
      throw new AppError("Email already in use", 409);
    }

    const phone = payload.phone.trim();
    const phoneExists = await UserModel.exists({ phone });
    if (phoneExists) {
      throw new AppError("Phone already in use", 409);
    }

    const user = await UserModel.create({
      _id: randomUUID(),
      name: payload.name,
      email,
      phone,
      businessName: payload.businessName,
      passwordHash: hashPassword(payload.password),
      role: Role.USER,
      communityIds: [],
      createdAt: new Date()
    });

    return toUser(user.toObject() as MongoUser);
  }

  public async createByAdmin(payload: AdminCreateUserInput): Promise<User & { temporaryPassword?: string }> {
    const temporaryPassword = payload.password || randomUUID().slice(0, 12);
    const user = await this.create({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      businessName: payload.businessName,
      password: temporaryPassword
    });

    return {
      ...user,
      temporaryPassword: payload.password ? undefined : temporaryPassword
    };
  }

  public async update(userId: string, payload: UpdateUserInput): Promise<User> {
    if (payload.email) {
      payload.email = payload.email.toLowerCase();
      const exists = await UserModel.exists({ email: payload.email, _id: { $ne: userId } });
      if (exists) {
        throw new AppError("Email already in use", 409);
      }
    }

    if (payload.phone) {
      payload.phone = payload.phone.trim();
      const exists = await UserModel.exists({ phone: payload.phone, _id: { $ne: userId } });
      if (exists) {
        throw new AppError("Phone already in use", 409);
      }
    }

    const updatePayload: UpdateUserInput & { passwordHash?: string } = { ...payload };
    if (payload.password) {
      updatePayload.passwordHash = hashPassword(payload.password);
      delete updatePayload.password;
    }

    const user = (await UserModel.findByIdAndUpdate(userId, updatePayload, { new: true }).lean()) as MongoUser | null;
    if (!user) {
      throw new AppError("User not found", 404);
    }

    return toUser(user);
  }

  public async delete(userId: string): Promise<void> {
    const deleted = (await UserModel.findByIdAndDelete(userId).lean()) as MongoUser | null;
    if (!deleted) {
      throw new AppError("User not found", 404);
    }
    await CommunityModel.updateMany({ memberIds: userId }, { $pull: { memberIds: userId } });
  }

  public async updatePhoto(userId: string, photoUrl: string): Promise<User> {
    const user = (await UserModel.findByIdAndUpdate(
      userId,
      { photoUrl },
      { new: true }
    ).lean()) as MongoUser | null;

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return toUser(user);
  }

  public async authenticate(payload: LoginInput): Promise<User> {
    const email = payload.email.toLowerCase();
    const user = (await UserModel.findOne({ email }).lean()) as MongoUser | null;

    if (!user || !verifyPassword(payload.password, user.passwordHash)) {
      throw new AppError("Invalid email or password", 401);
    }

    return toUser(user);
  }
}

export const userService = new UserService();
