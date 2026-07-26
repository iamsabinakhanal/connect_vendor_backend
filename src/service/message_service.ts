import { randomUUID } from "crypto";
import { CommunityModel, MessageModel, MongoMessage, UserModel } from "../database/mongo_models";
import { AppError } from "../errors/app_error";
import { Message } from "../models/message";

interface SendMessageInput {
  toUserId: string;
  communityId: string;
  content: string;
}

class MessageService {
  public async listForUser(userId: string): Promise<Message[]> {
    const messages = (await MessageModel.find({ $or: [{ fromUserId: userId }, { toUserId: userId }] }).lean()) as MongoMessage[];
    return messages.map((item) => ({
      id: item._id,
      fromUserId: item.fromUserId,
      toUserId: item.toUserId,
      communityId: item.communityId,
      content: item.content,
      createdAt: item.createdAt
    }));
  }

  public async send(fromUserId: string, payload: SendMessageInput): Promise<Message> {
    const fromUser = await UserModel.findById(fromUserId).lean();
    const toUser = await UserModel.findById(payload.toUserId).lean();

    if (!fromUser || !toUser) {
      throw new AppError("Sender or receiver not found", 404);
    }

    const community = await CommunityModel.findById(payload.communityId).lean();
    if (!community) {
      throw new AppError("Community not found", 404);
    }

    const fromInCommunity = community.memberIds.includes(fromUserId);
    const toInCommunity = community.memberIds.includes(payload.toUserId);

    if (!fromInCommunity || !toInCommunity) {
      throw new AppError("Users can message only members of same community", 403);
    }

    const message = await MessageModel.create({
      _id: randomUUID(),
      fromUserId,
      toUserId: payload.toUserId,
      communityId: payload.communityId,
      content: payload.content,
      createdAt: new Date()
    });

    return {
      id: message._id,
      fromUserId: message.fromUserId,
      toUserId: message.toUserId,
      communityId: message.communityId,
      content: message.content,
      createdAt: message.createdAt
    };
  }
}

export const messageService = new MessageService();
