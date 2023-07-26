import { TagType } from '@interfaces';
import { Schema, model } from 'mongoose';

const tagsSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'category',
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default model<TagType>('tag', tagsSchema);
