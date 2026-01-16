import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";
import { ILikeRepository } from "../repositories/like.repository";
import { IPostService } from "../services/post.service"; // <--- Mudou aqui
import { LikeToggleResponseDto } from "../dtos/like/response/like.toggle.response.dto";

export interface ILikeService {
  toggleLike(userId: string, postId: string): Promise<LikeToggleResponseDto>;
}

@injectable()
export class LikeService implements ILikeService {
  constructor(
    @inject(TYPES.LikeRepository) private likeRepository: ILikeRepository,
    @inject(TYPES.PostService) private postService: IPostService // <--- Injeção do Service existente
  ) {}

  async toggleLike(userId: string, postId: string): Promise<LikeToggleResponseDto> {
    // 1. Verificar se o usuário já deu like (Mock/Placeholder)
    const alreadyLiked = await this.likeRepository.hasUserLikedPost(userId, postId);

    if (alreadyLiked) {
      // 2. Usar o método existente no PostService para decrementar
      await this.likeRepository.removeLike(userId, postId);
      await this.postService.decrementLikeCount(postId); // <--- Reutilizando sua lógica
    } else {
      // 3. Usar o método existente no PostService para incrementar
      await this.likeRepository.addLike(userId, postId);
      await this.postService.incrementLikeCount(postId); // <--- Reutilizando sua lógica
    }

    // 4. Buscar o post atualizado para retornar o novo número
    const updatedPostDto = await this.postService.findPostById(postId);
    
    // ATENÇÃO: Veja o ponto 2 abaixo sobre o DTO
    return { 
      liked: !alreadyLiked, 
      newLikeCount: updatedPostDto.post.likeCount // <--- Precisamos garantir que isso exista
    };
  }
}