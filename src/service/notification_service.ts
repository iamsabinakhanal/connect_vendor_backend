import { randomUUID } from "crypto";
import { MongoNotification, NotificationModel, UserModel } from "../database/mongo_models";
import { AppError } from "../errors/app_error";
import { Notification } from "../models/notification";

interface SendNotificationInput {
  userId: string;
  title: string;
  body: string;
}

class NotificationService {
  public async send(payload: SendNotificationInput): Promise<Notification> {
    const exists = await UserModel.exists({ _id: payload.userId });
    if (!exists) {
      throw new AppError("User not found", 404);
    }

    const notification = await NotificationModel.create({
      _id: randomUUID(),
      userId: payload.userId,
      title: payload.title,
      body: payload.body,
      isRead: false,
      createdAt: new Date()
    });

    return {
      id: notification._id,
      userId: notification.userId,
      title: notification.title,
      body: notification.body,
      isRead: notification.isRead,
      createdAt: notification.createdAt
    };
  }

  public async listForUser(userId: string): Promise<Notification[]> {
    const notifications = (await NotificationModel.find({ userId }).lean()) as MongoNotification[];
    return notifications.map((item) => ({
      id: item._id,
      userId: item.userId,
      title: item.title,
      body: item.body,
      isRead: item.isRead,
      createdAt: item.createdAt
    }));
  }

  public async markAsRead(userId: string, notificationId: string): Promise<Notification> {
    const notification = (await NotificationModel.findOneAndUpdate({ _id: notificationId, userId }, { isRead: true }, { new: true }).lean()) as MongoNotification | null;
    if (!notification) {
      throw new AppError("Notification not found", 404);
    }

    return {
      id: notification._id,
      userId: notification.userId,
      title: notification.title,
      body: notification.body,
      isRead: notification.isRead,
      createdAt: notification.createdAt
    };
  }
}

export const notificationService = new NotificationService();
