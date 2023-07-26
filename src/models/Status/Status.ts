import { StatusType } from '@interfaces';
import { Schema, model } from 'mongoose';

const StatusSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default model<StatusType>('status', StatusSchema);
