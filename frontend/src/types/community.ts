export interface Community {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  ownerId?: string;
}

export interface CommunityResponse {
  data: Community[];
  totalItems: number;
  totalPages: number;
}