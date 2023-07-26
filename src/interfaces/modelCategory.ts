import { Document } from 'mongoose';

export interface CategoryType extends Document {
  name: string;
}
