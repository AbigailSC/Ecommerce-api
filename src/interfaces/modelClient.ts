import { Document, ObjectId } from 'mongoose';
import { SellerType } from './modelSeller';

export interface ClientType extends SellerType, Document {
  cartId: ObjectId;
}
