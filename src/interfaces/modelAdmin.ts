import { Document } from 'mongoose';

export interface AdminType extends Document {
  name: string;
  lastname: string;
  phone: number;
  email: string;
  document: string;
  image?: string;
  countryId: string;
  cityId: string;
}
