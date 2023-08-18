import { Document, ObjectId } from 'mongoose';

export interface HistoryType extends Document {
  orderId: ObjectId;
  userId: ObjectId;
  date: Date;
}
