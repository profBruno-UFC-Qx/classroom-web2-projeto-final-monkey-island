export interface Community {
  id: string;
  name: string;
  memberCount?: number;
  description: string;
  createdAt: string;
}

export interface CommunityRequest {
  name: string;
  description: string;
}

export interface CommunityResponse {
  data: Community[];
  totalItems: number;
  totalPages: number;
}
