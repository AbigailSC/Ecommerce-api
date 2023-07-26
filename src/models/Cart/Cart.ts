import { CartType } from '@interfaces';
import { Schema, model } from 'mongoose';

const cartSchema = new Schema({
  clientId: {
    type: String,
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
});

export default model<CartType>('cart', cartSchema);
