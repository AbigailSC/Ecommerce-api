import { Document } from 'mongoose';
import { AdminType } from './modelAdmin';

export interface SellerType extends AdminType, Document {
  address: string;
}
