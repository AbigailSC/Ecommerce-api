import { Document } from 'mongoose';

export interface StatusType extends Document {
  name: string;
}
