import { Document, ObjectId } from 'mongoose';

export interface OrderType extends Document {
  clientId: ObjectId;
  methodPaymentId: ObjectId;
  productId: ObjectId;
  quantity: number;
  statusId: ObjectId;
  address: string;
  amount: number;
  sellerId: ObjectId;
}
