export interface IQuery {
  page?: number;
  limit?: number;
}

export interface IPagination {
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  products: unknown[];
}
