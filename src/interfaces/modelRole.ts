import { Document } from 'mongoose';

export interface RoleType extends Document {
  name: string;
}
