import { MethodPaymentType } from '@interfaces';
import { Schema, model } from 'mongoose';

const methodPaymentSchema = new Schema({
  name: {
    type: String,
    required: true
  }
});

export default model<MethodPaymentType>('methodPayment', methodPaymentSchema);
