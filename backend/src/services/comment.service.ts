import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";
import { ICommentRepository } from "../repositories/comment.repository";
import { IPostService } from "./post.service";
import { CreateCommentDto } from "../dtos/comment/request/create.comment.dto";
import { Comment } from "../entities/comment";
import { CommentResponseDto } from "../dtos/comment/response/comment.response.dto";
import { IUserRepository } from "../repositories/user.repositorie";

export interface ICommentService {
  createComment(userId: string, postId: string, data: CreateCommentDto): Promise<CommentResponseDto>;
  deleteComment(userId: string, commentId: string): Promise<void>;
  getCommentsByPost(postId: string): Promise<CommentResponseDto[]>;
}

@injectable()
export class CommentService implements ICommentService {
  constructor(
    @inject(TYPES.CommentRepository) private commentRepository: ICommentRepository,
    @inject(TYPES.PostService) private postService: IPostService,
    @inject(TYPES.UserRepositoryDB) private userRepository: IUserRepository
  ) {}

  async createComment(userId: string, postId: string, data: CreateCommentDto): Promise<CommentResponseDto> {
    await this.postService.findPostById(postId);

    const comment = new Comment();
    comment.userId = userId;
    comment.postId = postId;
    comment.content = data.content;
    comment.parentId = data.parentId || null;

    const savedComment = await this.commentRepository.save(comment);
    await this.postService.incrementCommentCount(postId);

    const author = await this.userRepository.getById(userId);

    return this.toDto(savedComment, author);
  }

  async deleteComment(userId: string, commentId: string): Promise<void> {
    const comment = await this.commentRepository.findById(commentId);

    if (!comment) {
      throw new Error("Comment not found");
    }

    if (comment.userId !== userId) {
        throw new Error("You are not authorized to delete this comment");
    }

    await this.commentRepository.delete(commentId);
    await this.postService.decrementCommentCount(comment.postId);
  }

  async getCommentsByPost(postId: string): Promise<CommentResponseDto[]> {
    const allComments = await this.commentRepository.findAllByPostId(postId);

    const userIds = [...new Set(allComments.map(c => c.userId))];
    const usersMap = new Map<string, any>();
    
    for (const uid of userIds) {
        const user = await this.userRepository.getById(uid);
        if (user) {
            usersMap.set(uid, user);
        }
    }

    const dtos = allComments.map(c => {
        const author = usersMap.get(c.userId);
        return this.toDto(c, author);
    });

    const commentMap: { [key: string]: CommentResponseDto } = {};
    const roots: CommentResponseDto[] = [];

    dtos.forEach(dto => {
        dto.replies = [];
        commentMap[dto.id] = dto;
    });

    dtos.forEach(dto => {
        if (dto.parentId) {
            const parent = commentMap[dto.parentId];
            if (parent) {
                parent.replies.push(dto);
            } else {
                roots.push(dto); 
            }
        } else {
            roots.push(dto);
        }
    });

    return roots.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  private toDto(entity: Comment, user?: any): CommentResponseDto {
    return {
      id: entity.id,
      content: entity.content,
      userId: entity.userId,
      parentId: entity.parentId,
      createdAt: entity.createdAt,
      replies: [],
      author: user ? {
          id: user.id,
          name: user.name
      } : undefined
    };
  }
}