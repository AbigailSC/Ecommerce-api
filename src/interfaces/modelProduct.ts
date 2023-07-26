import { Document } from 'mongoose';

export interface ProductType extends Document {
  name: string;
  description: string;
  price: number;
  stock: number;
  discount: number;
  sellerId: string;
  isActive: boolean;
  categoryId: string;
  methodPayment: string[];
  isAvailable: boolean;
  imageId: string[];
}
