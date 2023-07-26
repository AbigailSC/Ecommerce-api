import { Document } from 'mongoose';

export interface HistoryType extends Document {
  orderId: string;
  userId: string;
  date: Date;
}
