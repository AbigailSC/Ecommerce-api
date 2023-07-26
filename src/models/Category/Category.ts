import { CategoryType } from '@interfaces';
import { Schema, model } from 'mongoose';

const categorySchema = new Schema(
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

export default model<CategoryType>('category', categorySchema);
