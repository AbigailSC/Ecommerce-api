import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { UserType } from '@interfaces';
import { ROLES } from '@constants';

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
      required: true,
      trim: true
    },
    rol: {
      type: String,
      required: false,
      default: ROLES.Client
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
usersSchema.methods.toJSON = function () {
  const {
    _v,
    password,
    _id,
    emailVerifyTokenLink,
    createdAt,
    updatedAt,
    ...user
  } = this.toObject();
  return user;
};

export default model<UserType>('user', usersSchema);
