import { Document } from 'mongoose';

export interface TagType extends Document {
  name: string;
  categoryId: string;
}
