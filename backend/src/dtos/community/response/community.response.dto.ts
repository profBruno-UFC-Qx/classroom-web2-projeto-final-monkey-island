export interface CommunityResponseDto {
  id: string;
  name: string;
  description: string;
  memberCount?: number;
  ownerId?: string;
  createdAt: Date;
}
