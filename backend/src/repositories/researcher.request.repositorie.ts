import { injectable } from "inversify";
import {
  ResearcherRequest,
  ResearcherRequestStatus,
} from "../entities/researcher.request";
import { AppDataSource } from "../config/db.connection";
import { User } from "../entities/User";

export interface IResearcherRequestRepositorie {
  save(researcherRequest: ResearcherRequest): Promise<ResearcherRequest>;
  findRequestsByUser(user: User): Promise<ResearcherRequest[]>;
  findPendingRequests(): Promise<ResearcherRequest[]>;
  existsPendingRequest(user: User): Promise<boolean>;
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

  async findRequestsByUser(user: User): Promise<ResearcherRequest[]> {
    return await this.repo.find({ where: { user } });
  }

  async findPendingRequests(): Promise<ResearcherRequest[]> {
    return await this.repo.find({
      where: { status: ResearcherRequestStatus.PENDING },
    });
  }

  async existsPendingRequest(user: User): Promise<boolean> {
    return await this.repo.exists({
      where: { user, status: ResearcherRequestStatus.PENDING },
    });
  }
}
