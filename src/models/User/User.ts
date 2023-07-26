import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { UserType } from '@interfaces';

const usersSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: false,
      trim: true
    },
    rol: {
      type: String,
      required: true
    },
    verified: {
      type: Boolean,
      required: true,
      default: false
    },
    isActive: {
      type: Boolean,
      required: false,
      default: true
    },
    resetPasswordTokenLink: {
      type: String,
      default: '',
      required: false
    },
    emailVerifyTokenLink: {
      type: String,
      default: '',
      required: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

usersSchema.methods.encryptPassword = async (
  password: string
): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

usersSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default model<UserType>('user', usersSchema);
