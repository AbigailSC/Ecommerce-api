import { SellerType } from '@interfaces';
import { Schema, model } from 'mongoose';

const SellerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: Schema.Types.ObjectId,
      ref: 'country',
      required: true
    },
    city: {
      type: Schema.Types.ObjectId,
      ref: 'city',
      required: true
    },
    phone: {
      type: Number,
      required: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    document: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default model<SellerType>('seller', SellerSchema);
