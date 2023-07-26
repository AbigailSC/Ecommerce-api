import { AdminType } from '@interfaces';
import { Schema, model } from 'mongoose';

const AdminSchema = new Schema(
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

export default model<AdminType>('admin', AdminSchema);
