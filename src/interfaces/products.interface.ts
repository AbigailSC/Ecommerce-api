import { ProductType } from './modelProduct';

export interface ProductsType {
  products: ProductType[];
}

export interface ProductsResponse<T> {
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  products: T[];
}
