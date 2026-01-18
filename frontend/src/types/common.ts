//funções comuns entre os tipos que podem ser compartilhadas


export interface PaginatedResponse<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
}