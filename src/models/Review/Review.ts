import { ReviewType } from '@interfaces';
import { Schema, model } from 'mongoose';

const reviewsSchema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'client',
      required: true
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'product',
      required: true
    },
    review: {
      type: String,
      required: false,
      default: '',
      trim: true,
      maxlength: 250
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default model<ReviewType>('review', reviewsSchema);
