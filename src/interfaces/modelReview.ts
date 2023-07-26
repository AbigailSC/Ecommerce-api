import { Document } from 'mongoose';

export interface ReviewType extends Document {
  clientId: string;
  productId: string;
  review: string;
  rating: number;
  isActive: boolean;
}
