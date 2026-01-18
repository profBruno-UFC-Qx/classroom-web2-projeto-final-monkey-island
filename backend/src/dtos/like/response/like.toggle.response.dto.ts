export interface LikeToggleResponseDto {
  liked: boolean; // true se acabou de dar like, false se removeu
  newLikeCount: number; // A contagem atualizada para atualizar a UI
}