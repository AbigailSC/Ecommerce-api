import { Document } from 'mongoose';

export interface OrderType extends Document {
  clientId: string;
  methodPaymentId: string;
  productId: string;
  quantity: number;
  statusId: string;
  address: string;
  amount: number;
  sellerId: string;
}
