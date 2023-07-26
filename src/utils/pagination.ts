import { ProductType } from '@interfaces';

export const paginate = (
  products: ProductType[],
  page: number,
  limit: number
): ProductType[] => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  return products.slice(startIndex, endIndex);
};
