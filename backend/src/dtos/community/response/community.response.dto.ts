export interface CommunityResponseDto {
  id: string;
  name: string;
  description: string;
  memberCount?: number;
  createdAt: Date;
}
