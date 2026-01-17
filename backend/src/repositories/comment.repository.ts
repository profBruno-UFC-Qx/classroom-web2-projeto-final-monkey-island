import { injectable } from "inversify";
import { AppDataSource } from "../config/db.connection";
import { Comment } from "../entities/comment";


export interface ICommentRepository {
  save(comment: Comment): Promise<Comment>;
  delete(commentId: string): Promise<void>;
  findById(commentId: string): Promise<Comment | null>;
  findAllByPostId(postId: string): Promise<Comment[]>;
}

@injectable()
export class CommentRepositoryDB implements ICommentRepository {
  private get repo() {
    return AppDataSource.getRepository(Comment);
  }

  async save(comment: Comment): Promise<Comment> {
    return await this.repo.save(comment);
  }

  async delete(commentId: string): Promise<void> {
    await this.repo.delete(commentId);
  }

  async findById(commentId: string): Promise<Comment | null> {
    return await this.repo.findOne({ where: { id: commentId } });
  }

  async findAllByPostId(postId: string): Promise<Comment[]> {
    return await this.repo.find({
      where: { postId: postId },
      order: { createdAt: "ASC" } 
    });
  }
}