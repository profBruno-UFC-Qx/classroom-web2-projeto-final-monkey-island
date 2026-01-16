import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";
import { IPostLikeRepository } from "../repositories/post.like.repository";
import { IPostService } from "./post.service"; // Reutilizando seu serviço existente
import { PostLike } from "../entities/post.like";
import { User } from "../entities/User";
import { Post } from "../entities/post";
import { ToggleLikeResponseDto } from "../dtos/post_like/response/toggle.like.response.dto";

export interface IPostLikeService {
  toggleLike(userId: string, postId: string): Promise<ToggleLikeResponseDto>;
}

@injectable()
export class PostLikeService implements IPostLikeService {
  constructor(
    @inject(TYPES.PostLikeRepository)
    private likeRepository: IPostLikeRepository,
    @inject(TYPES.PostService) // Injetamos seu PostService existente
    private postService: IPostService 
  ) {}

  async toggleLike(userId: string, postId: string): Promise<ToggleLikeResponseDto> {
    // 1. Verifica se o Post existe (Seu PostService já lança erro se não existir)
    // Buscamos o post para pegar a contagem atual depois
    const postDto = await this.postService.findPostById(postId);

    // 2. Verifica se o usuário já deu like (usando nosso repo placeholder)
    const existingLike = await this.likeRepository.findByUserAndPost(userId, postId);

    let isLiked = false;

    if (existingLike) {
      // CENÁRIO: REMOVER LIKE (UNLIKE)
      await this.likeRepository.delete(existingLike.id);
      
      // Usa seu método existente que já decrementa atomicamente no DB
      await this.postService.decrementLikeCount(postId);
      
      isLiked = false;
    } else {
      // CENÁRIO: ADICIONAR LIKE
      const newLike = new PostLike();
      newLike.user = { id: userId } as User;
      newLike.post = { id: postId } as Post;
      
      await this.likeRepository.save(newLike);
      
      // Usa seu método existente que já incrementa atomicamente no DB
      await this.postService.incrementLikeCount(postId);
      
      isLiked = true;
    }

    // 3. Retorna o estado atualizado
    // O postDto buscado no início pode estar desatualizado após o increment/decrement.
    // Buscamos novamente apenas para garantir o count correto na resposta (opcional, mas recomendado)
    const updatedPost = await this.postService.findPostById(postId);
    
    // Nota: Seu PostResponseDto atual não parece expor o 'likeCount' explicitamente na interface,
    // mas a entidade Post tem. Se o 'updatedPost.post' não tiver likeCount, você precisará adicionar no PostResponseDto.
    // Assumindo que você adicione ou acesse via any temporariamente para o teste:
    const currentCount = (updatedPost.post as any).likeCount ?? 0; 

    return {
      isLiked,
      likesCount: currentCount
    };
  }
}