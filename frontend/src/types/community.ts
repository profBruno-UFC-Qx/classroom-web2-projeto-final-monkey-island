import type { PaginatedResponse } from './common';

export interface Community {
  id: string;
  name: string;
  memberCount?: number;
  ownerId?: string;
  description: string;
  createdAt: string;
}

export interface CommunityRequest {
  name: string;
  description: string;
}

export type CommunityResponse = PaginatedResponse<Community>;