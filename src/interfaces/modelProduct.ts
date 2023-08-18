import { Document, ObjectId } from 'mongoose';

export interface ProductType extends Document {
  name: string;
  description: string;
  price: number;
  stock: number;
  discount: number;
  sellerId: ObjectId;
  isActive: boolean;
  categoryId: ObjectId;
  methodPayment: string[];
  isAvailable: boolean;
  imageId: string[];
}
