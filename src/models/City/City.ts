import { CityType } from '@interfaces';
import { Schema, model } from 'mongoose';

const citySchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    country: {
      type: Schema.Types.ObjectId,
      ref: 'country',
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default model<CityType>('city', citySchema);
