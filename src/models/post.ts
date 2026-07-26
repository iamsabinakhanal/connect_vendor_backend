export interface Post {
  id: string;
  authorId: string;
  communityId: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: Date;
}
