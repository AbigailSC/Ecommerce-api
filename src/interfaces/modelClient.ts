import { Document } from 'mongoose';
import { SellerType } from './modelSeller';

export interface ClientType extends SellerType, Document {}
