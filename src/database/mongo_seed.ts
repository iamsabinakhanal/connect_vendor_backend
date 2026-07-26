import { CategoryModel, CommunityModel, NotificationModel, PostModel, ReportModel, UserModel } from "./mongo_models";
import { CommunityVisibility, Role } from "../type/domain";
import { hashPassword } from "../utils/password";

const now = (): Date => new Date();

const seedUser = async (input: {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  password: string;
  role: Role;
  communityIds: string[];
}): Promise<void> => {
  await UserModel.updateOne(
    { _id: input.id },
    {
      $setOnInsert: {
        _id: input.id,
        name: input.name,
        email: input.email,
        phone: input.phone,
        businessName: input.businessName,
        passwordHash: hashPassword(input.password),
        role: input.role,
        communityIds: input.communityIds,
        createdAt: now()
      }
    },
    { upsert: true }
  );

  await UserModel.updateOne(
    { _id: input.id },
    {
      $set: {
        phone: input.phone,
        passwordHash: hashPassword(input.password)
      }
    }
  );
};

export const seedIds = {
  adminId: "11111111-1111-1111-1111-111111111111",
  vendor1Id: "22222222-2222-2222-2222-222222222222",
  vendor2Id: "33333333-3333-3333-3333-333333333333",
  categoryId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  communityId: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
};

export const seedDatabase = async (): Promise<void> => {
  await seedUser({
    id: seedIds.adminId,
    name: "Admin",
    email: "admin@pasaleyguff.com",
    phone: "9800000001",
    businessName: "Pasaley Guff HQ",
    password: "admin123",
    role: Role.ADMIN,
    communityIds: [seedIds.communityId]
  });

  await seedUser({
    id: seedIds.vendor1Id,
    name: "Vendor One",
    email: "vendor1@example.com",
    phone: "9800000002",
    businessName: "Vendor One Store",
    password: "vendor123",
    role: Role.USER,
    communityIds: [seedIds.communityId]
  });

  await seedUser({
    id: seedIds.vendor2Id,
    name: "Vendor Two",
    email: "vendor2@example.com",
    phone: "9800000003",
    businessName: "Vendor Two Shop",
    password: "vendor123",
    role: Role.USER,
    communityIds: [seedIds.communityId]
  });

  await CategoryModel.updateOne(
    { _id: seedIds.categoryId },
    {
      $setOnInsert: {
        _id: seedIds.categoryId,
        name: "Community",
        description: "Default brand/community category",
        createdAt: now()
      }
    },
    { upsert: true }
  );

  await CommunityModel.updateOne(
    { _id: seedIds.communityId },
    {
      $setOnInsert: {
        _id: seedIds.communityId,
        name: "Main Vendors",
        description: "Main public community for vendors",
        categoryId: seedIds.categoryId,
        visibility: CommunityVisibility.PUBLIC,
        createdBy: seedIds.adminId,
        memberIds: [seedIds.adminId, seedIds.vendor1Id, seedIds.vendor2Id],
        createdAt: now()
      }
    },
    { upsert: true }
  );

  await UserModel.updateOne(
    { _id: seedIds.adminId },
    {
      $addToSet: {
        communityIds: seedIds.communityId
      }
    }
  );

  await PostModel.deleteMany({});
  await ReportModel.deleteMany({});
  await NotificationModel.deleteMany({});
};