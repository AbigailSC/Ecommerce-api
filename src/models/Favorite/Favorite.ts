import { FavoriteType } from '@interfaces';
import { Schema, model } from 'mongoose';

const FavoriteSchema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'client',
      required: true
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'product',
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          default: 1
        }
      }
    ]
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default model<FavoriteType>('favorite', FavoriteSchema);
