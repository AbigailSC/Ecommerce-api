import { ClientType } from '@interfaces';
import { Schema, model } from 'mongoose';

const clientSchema = new Schema(
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
    cartId: {
      type: Schema.Types.ObjectId,
      ref: 'cart',
      required: true
    },
    countryId: {
      type: Schema.Types.ObjectId,
      ref: 'country',
      required: true
    },
    cityId: {
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

clientSchema.methods.toJSON = function () {
  const { _v, _id, createdAt, updatedAt, ...client } = this.toObject();
  return client;
};

export default model<ClientType>('client', clientSchema);
