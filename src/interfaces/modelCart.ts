import { Document, ObjectId } from 'mongoose';

export interface CartType extends Document {
  clientId: string;
  products: ProductItem[];
}

interface ProductItem {
  productId: ObjectId;
  quantity: number;
}
