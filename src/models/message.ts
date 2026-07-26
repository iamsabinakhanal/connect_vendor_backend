export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  communityId: string;
  content: string;
  createdAt: Date;
}
