import { randomUUID } from "crypto";
import { CommunityModel, MongoPost, PostModel, UserModel } from "../database/mongo_models";
import { AppError } from "../errors/app_error";
import { Post } from "../models/post";
import { env } from "../config/env";

interface CreatePostInput {
  communityId: string;
  title: string;
  content: string;
  imageUrl?: string;
}

interface UpdatePostInput {
  title?: string;
  content?: string;
  imageUrl?: string;
}

const toPost = (post: MongoPost): Post => ({
  id: post._id,
  authorId: post.authorId,
  communityId: post.communityId,
  title: post.title,
  content: post.content,
  imageUrl: post.imageUrl
    ? post.imageUrl.startsWith("http")
      ? post.imageUrl
      : `${env.publicBaseUrl}${post.imageUrl}`
    : undefined,
  createdAt: post.createdAt
});

class PostService {
  public async list(communityId?: string): Promise<Post[]> {
    if (!communityId) {
      const posts = (await PostModel.find().lean()) as MongoPost[];
      return posts.map(toPost);
    }
    const posts = (await PostModel.find({ communityId }).lean()) as MongoPost[];
    return posts.map(toPost);
  }

  public async getById(postId: string): Promise<Post> {
    const post = (await PostModel.findById(postId).lean()) as MongoPost | null;
    if (!post) {
      throw new AppError("Post not found", 404);
    }
    return toPost(post);
  }

  public async create(userId: string, payload: CreatePostInput): Promise<Post> {
    const user = await UserModel.findById(userId).lean();
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const community = await CommunityModel.findById(payload.communityId).lean();
    if (!community) {
      throw new AppError("Community not found", 404);
    }

    const isMember = community.memberIds.includes(userId);
    if (!isMember) {
      throw new AppError("Join the community before creating posts", 403);
    }

    const post = await PostModel.create({
      _id: randomUUID(),
      authorId: userId,
      communityId: payload.communityId,
      title: payload.title,
      content: payload.content,
      imageUrl: payload.imageUrl,
      createdAt: new Date()
    });

    return toPost(post.toObject() as MongoPost);
  }

  public async update(userId: string, postId: string, payload: UpdatePostInput): Promise<Post> {
    const post = (await PostModel.findById(postId).lean()) as MongoPost | null;
    if (!post) {
      throw new AppError("Post not found", 404);
    }

    if (post.authorId !== userId) {
      throw new AppError("You can update only your own post", 403);
    }

    const updated = (await PostModel.findByIdAndUpdate(postId, payload, { new: true }).lean()) as MongoPost | null;
    if (!updated) {
      throw new AppError("Post not found", 404);
    }

    return toPost(updated);
  }

  public async delete(userId: string, postId: string): Promise<void> {
    const post = (await PostModel.findById(postId).lean()) as MongoPost | null;
    if (!post) {
      throw new AppError("Post not found", 404);
    }

    if (post.authorId !== userId) {
      throw new AppError("You can delete only your own post", 403);
    }

    await PostModel.deleteOne({ _id: postId });
  }

  public async adminDelete(postId: string): Promise<void> {
    const deleted = (await PostModel.findByIdAndDelete(postId).lean()) as MongoPost | null;
    if (!deleted) {
      throw new AppError("Post not found", 404);
    }
  }
}

export const postService = new PostService();
