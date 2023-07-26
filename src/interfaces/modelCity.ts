import { Document } from 'mongoose';

export interface CityType extends Document {
  name: string;
}
