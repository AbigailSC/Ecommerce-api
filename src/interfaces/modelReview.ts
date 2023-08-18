import { Document, ObjectId } from 'mongoose';

export interface ReviewType extends Document {
  clientId: ObjectId;
  productId: ObjectId;
  review: string;
  rating: number;
  isActive: boolean;
}
