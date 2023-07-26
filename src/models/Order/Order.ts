import { OrderType } from '@interfaces';
import { Schema, model } from 'mongoose';

const orderSchema = new Schema({
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'client',
    required: true
  },
  methodPaymentId: {
    type: Schema.Types.ObjectId,
    ref: 'methodPayment',
    required: true
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  statusId: {
    type: Schema.Types.ObjectId,
    ref: 'status',
    required: false,
    default: '000000000000000000000001'
  },
  address: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: 'seller',
    required: true
  }
});

export default model<OrderType>('order', orderSchema);
