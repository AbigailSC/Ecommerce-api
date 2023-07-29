import { ProductType } from '@interfaces';
import { Schema, model } from 'mongoose';

const productSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      lowercase: true
    },
    description: {
      type: String,
      trim: true,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    stock: {
      type: Number,
      required: true
    },
    discount: {
      type: Number,
      required: false,
      min: 0,
      max: 100
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: 'seller',
      required: true
    },
    isActive: {
      type: Boolean,
      required: false,
      default: true
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'category',
      required: true
    },
    methodPayment: [
      {
        type: Schema.Types.ObjectId,
        ref: 'methodPayment',
        required: true
      }
    ],
    isAvailable: {
      type: Boolean,
      default: true
    },
    imageId: [
      {
        type: String,
        required: false
      }
    ]
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default model<ProductType>('product', productSchema);
