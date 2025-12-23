import { injectable } from "inversify";
import {
  ResearcherRequest,
  ResearcherRequestStatus,
} from "../entities/researcher.request";
import { AppDataSource } from "../config/db.connection";

export interface IResearcherRequestRepositorie {
  save(researcherRequest: ResearcherRequest): Promise<ResearcherRequest>;
  findRequestsByUserId(userId: string): Promise<ResearcherRequest[]>;
  findPendingRequests(): Promise<ResearcherRequest[]>;
  existsPendingRequest(userId: string): Promise<boolean>;
  findRequestById(requestId: string): Promise<ResearcherRequest | null>;
}

@injectable()
export class ResearcherRequestRepositorieDB
  implements IResearcherRequestRepositorie
{
  private get repo() {
    return AppDataSource.getRepository(ResearcherRequest);
  }

  async save(researcherRequest: ResearcherRequest): Promise<ResearcherRequest> {
    return await this.repo.save(researcherRequest);
  }

  async findRequestsByUserId(userId: string): Promise<ResearcherRequest[]> {
    console.log(userId);
    const result = await this.repo.find({ where: { user: { id: userId } } });

    return result;
  }

  async findRequestById(requestId: string): Promise<ResearcherRequest | null> {
    return await this.repo.findOne({ where: { id: requestId } });
  }

  async findPendingRequests(): Promise<ResearcherRequest[]> {
    return await this.repo.find({
      where: { status: ResearcherRequestStatus.PENDING },
    });
  }

  async existsPendingRequest(userId: string): Promise<boolean> {
    return await this.repo.exists({
      where: { user: { id: userId }, status: ResearcherRequestStatus.PENDING },
    });
  }
}
