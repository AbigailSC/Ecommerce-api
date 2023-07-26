import { HistoryType } from '@interfaces';
import { Schema, model } from 'mongoose';

const HistorySchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'order',
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    date: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default model<HistoryType>('history', HistorySchema);
