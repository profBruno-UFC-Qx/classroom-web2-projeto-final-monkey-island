import { PostRequestDto } from "../dtos/post/request/post.request.dto";

export interface IPostService {
  createDraftPost(postRequest: PostRequestDto): Promise<>;
}
