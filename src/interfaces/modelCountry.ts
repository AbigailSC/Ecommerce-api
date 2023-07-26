import { Document } from 'mongoose';

export interface CountryType extends Document {
  name: string;
}
