import { RoleType } from '@interfaces';
import { Schema, model } from 'mongoose';

const rolSchema = new Schema(
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

export default model<RoleType>('role', rolSchema);
