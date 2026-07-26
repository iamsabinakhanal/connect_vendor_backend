import { model, Schema } from "mongoose";
import { CommunityVisibility, ReportStatus, Role } from "../type/domain";

export interface MongoUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  photoUrl?: string;
  passwordHash: string;
  role: Role;
  communityIds: string[];
  createdAt: Date;
}

export interface MongoCategory {
  _id: string;
  name: string;
  description?: string;
  createdAt: Date;
}

export interface MongoCommunity {
  _id: string;
  name: string;
  description?: string;
  categoryId: string;
  visibility: CommunityVisibility;
  createdBy: string;
  memberIds: string[];
  createdAt: Date;
}

export interface MongoPost {
  _id: string;
  authorId: string;
  communityId: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: Date;
}

export interface MongoMessage {
  _id: string;
  fromUserId: string;
  toUserId: string;
  communityId: string;
  content: string;
  createdAt: Date;
}

export interface MongoReport {
  _id: string;
  reporterId: string;
  targetType: "POST" | "USER";
  targetId: string;
  reason: string;
  status: ReportStatus;
  createdAt: Date;
}

export interface MongoNotification {
  _id: string;
  userId: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: Date;
}

const stringId = {
  type: String,
  required: true
};

const userSchema = new Schema(
  {
    _id: stringId,
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    businessName: { type: String, required: true },
    photoUrl: { type: String },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true },
    communityIds: { type: [String], required: true, default: [] },
    createdAt: { type: Date, required: true }
  },
  { versionKey: false }
);

const categorySchema = new Schema(
  {
    _id: stringId,
    name: { type: String, required: true, unique: true },
    description: { type: String },
    createdAt: { type: Date, required: true }
  },
  { versionKey: false }
);

const communitySchema = new Schema(
  {
    _id: stringId,
    name: { type: String, required: true },
    description: { type: String },
    categoryId: { type: String, required: true },
    visibility: { type: String, enum: Object.values(CommunityVisibility), required: true },
    createdBy: { type: String, required: true },
    memberIds: { type: [String], required: true, default: [] },
    createdAt: { type: Date, required: true }
  },
  { versionKey: false }
);

const postSchema = new Schema(
  {
    _id: stringId,
    authorId: { type: String, required: true },
    communityId: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String },
    createdAt: { type: Date, required: true }
  },
  { versionKey: false }
);

const messageSchema = new Schema(
  {
    _id: stringId,
    fromUserId: { type: String, required: true },
    toUserId: { type: String, required: true },
    communityId: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, required: true }
  },
  { versionKey: false }
);

const reportSchema = new Schema(
  {
    _id: stringId,
    reporterId: { type: String, required: true },
    targetType: { type: String, enum: ["POST", "USER"], required: true },
    targetId: { type: String, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: Object.values(ReportStatus), required: true },
    createdAt: { type: Date, required: true }
  },
  { versionKey: false }
);

const notificationSchema = new Schema(
  {
    _id: stringId,
    userId: { type: String, required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    isRead: { type: Boolean, required: true, default: false },
    createdAt: { type: Date, required: true }
  },
  { versionKey: false }
);

export const UserModel = model("User", userSchema);
export const CategoryModel = model("Category", categorySchema);
export const CommunityModel = model("Community", communitySchema);
export const PostModel = model("Post", postSchema);
export const MessageModel = model("Message", messageSchema);
export const ReportModel = model("Report", reportSchema);
export const NotificationModel = model("Notification", notificationSchema);