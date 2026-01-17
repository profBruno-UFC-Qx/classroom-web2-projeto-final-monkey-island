import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";
import { ICommentRepository } from "../repositories/comment.repository";
import { IPostService } from "./post.service"; // Reutiliza seu serviço de Posts
import { CreateCommentDto } from "../dtos/comment/request/create.comment.dto";
import { CommentMemory } from "../entities/comment.memory";
import { CommentResponseDto } from "../dtos/comment/response/comment.response.dto";
import { v4 as uuidv4 } from "uuid"; // Certifique-se de ter 'npm install uuid' e '@types/uuid'

export interface ICommentService {
  createComment(userId: string, postId: string, data: CreateCommentDto): Promise<CommentResponseDto>;
  deleteComment(userId: string, commentId: string): Promise<void>;
  getCommentsByPost(postId: string): Promise<CommentResponseDto[]>;
}

@injectable()
export class CommentService implements ICommentService {
  constructor(
    @inject(TYPES.CommentRepository) private commentRepository: ICommentRepository,
    @inject(TYPES.PostService) private postService: IPostService
  ) {}

  async createComment(userId: string, postId: string, data: CreateCommentDto): Promise<CommentResponseDto> {
    // 1. Verifica se o post existe (banco real)
    await this.postService.findPostById(postId);

    // 2. Cria a entidade em memória
    const comment = new CommentMemory();
    comment.id = uuidv4();
    comment.userId = userId;
    comment.postId = postId;
    comment.content = data.content;
    comment.parentId = data.parentId || null;
    comment.createdAt = new Date();

    // 3. Salva na RAM
    await this.commentRepository.save(comment);

    // 4. Incrementa contador no Banco Real
    await this.postService.incrementCommentCount(postId);

    return this.toDto(comment);
  }

  async deleteComment(userId: string, commentId: string): Promise<void> {
    const comment = await this.commentRepository.findById(commentId);

    if (!comment) {
      throw new Error("Comment not found");
    }

    // Regra: Apenas o dono pode apagar (ou admin, se tiver essa lógica)
    if (comment.userId !== userId) {
        // Você pode relaxar isso para o dono do POST também poder apagar, se quiser.
        throw new Error("You are not authorized to delete this comment");
    }

    // 1. Remove da RAM
    await this.commentRepository.delete(commentId);

    // 2. Decrementa contador no Banco Real
    await this.postService.decrementCommentCount(comment.postId);
  }

  async getCommentsByPost(postId: string): Promise<CommentResponseDto[]> {
    // Busca todos os comentários flat (lista plana)
    const allComments = await this.commentRepository.findAllByPostId(postId);

    // Transforma em DTOs
    const dtos = allComments.map(c => this.toDto(c));

    // Monta a árvore (Tree structure)
    const commentMap: { [key: string]: CommentResponseDto } = {};
    const roots: CommentResponseDto[] = [];

    // Primeiro pass: Mapear todos pelo ID
    dtos.forEach(dto => {
        dto.replies = []; // Garante array vazio
        commentMap[dto.id] = dto;
    });

    // Segundo pass: Conectar filhos aos pais
    dtos.forEach(dto => {
        if (dto.parentId) {
            const parent = commentMap[dto.parentId];
            if (parent) {
                parent.replies.push(dto);
            } else {
                // Se o pai não for encontrado (ex: deletado), trata como raiz ou ignora
                roots.push(dto); 
            }
        } else {
            roots.push(dto);
        }
    });

    // Ordena por data (opcional)
    return roots.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  private toDto(entity: CommentMemory): CommentResponseDto {
    return {
      id: entity.id,
      content: entity.content,
      userId: entity.userId,
      parentId: entity.parentId,
      createdAt: entity.createdAt,
      replies: []
    };
  }
}