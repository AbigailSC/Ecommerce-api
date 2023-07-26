import { Document } from 'mongoose';

export interface CartType extends Document {
  clientId: string;
  products: ProductItem[];
}

interface ProductItem {
  productId: string;
  quantity: number;
}
