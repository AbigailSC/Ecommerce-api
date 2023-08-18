import { Document, ObjectId } from 'mongoose';

export interface TagType extends Document {
  name: string;
  categoryId: ObjectId;
}
