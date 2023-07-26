import { Document } from 'mongoose';

export interface UserType extends Document {
  email: string;
  password: string;
  rol: string;
  verified: boolean;
  isActive: boolean;
  resetPasswordTokenLink: string;
  emailVerifyTokenLink: string;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  encryptPassword: (password: string) => Promise<string>;
}
