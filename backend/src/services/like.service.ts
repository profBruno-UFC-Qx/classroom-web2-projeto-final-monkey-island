import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";
import { ILikeRepository } from "../repositories/like.repository";
import { IPostService } from "../services/post.service";
import { LikeToggleResponseDto } from "../dtos/like/response/like.toggle.response.dto";

export interface ILikeService {
  toggleLike(userId: string, postId: string): Promise<LikeToggleResponseDto>;
}

@injectable()
export class LikeService implements ILikeService {
  constructor(
    @inject(TYPES.LikeRepository) private likeRepository: ILikeRepository,
    @inject(TYPES.PostService) private postService: IPostService
  ) {}

  async toggleLike(userId: string, postId: string): Promise<LikeToggleResponseDto> {
    const alreadyLiked = await this.likeRepository.hasUserLikedPost(userId, postId);

    if (alreadyLiked) {
      await this.likeRepository.removeLike(userId, postId);
    } else {
      await this.likeRepository.addLike(userId, postId);
    }

    const updatedPostDto = await this.postService.findPostById(postId);
    
    return { 
      liked: !alreadyLiked, 
      newLikeCount: updatedPostDto.post.likeCount
    };
  }
}