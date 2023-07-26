import { CountryType } from '@interfaces';
import { Schema, model } from 'mongoose';

const countrySchema = new Schema(
  {
    name: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default model<CountryType>('country', countrySchema);
