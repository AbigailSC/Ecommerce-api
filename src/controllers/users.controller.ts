import { RequestHandler } from 'express';

import { UserSchema } from '@models';

import { catchAsync } from '@middleware';

import { ROLES } from '@constants';
import { CustomRequest, UserType } from '@interfaces';
import { getAdminUser, getClientUser, getSellerUser } from '@utils';
import { generateToken } from '@config';

export const createUser: RequestHandler = catchAsync(async (req, res) => {
  const { email, password }: UserType = req.body;
  const sellerKey = req.headers['seller-key'] as string;
  const adminKey = req.headers['admin-key'] as string;

  const newUser = new UserSchema({
    email
  });

  const token = await generateToken(newUser.id);
  newUser.emailVerifyTokenLink = token;

  if (sellerKey) {
    newUser.rol = ROLES.Seller;
  }

  if (adminKey) {
    newUser.rol = ROLES.Admin;
  }

  const encryptedPassword = await newUser.encryptPassword(password);
  newUser.password = encryptedPassword;
  const savedUser = await newUser.save();

  return res.status(201).json({
    status: res.statusCode,
    message: 'User created',
    data: savedUser
  });
});

export const getUsers: RequestHandler = catchAsync(async (_req, res) => {
  const allUsers = await UserSchema.find({ isActive: true });
  if (allUsers.length === 0) res.json({ message: 'No users found' });
  res.json({
    status: res.statusCode,
    message: 'Users found',
    data: allUsers
  });
});

export const getUserById: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = await UserSchema.findById(id);
  if (user === null) {
    return res.json({ status: res.statusCode, message: 'User not found!' });
  }
  res.json({
    status: res.statusCode,
    message: 'User found',
    data: user
  });
});

export const updateUser: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { password }: UserType = req.body;
  const updateUser = await UserSchema.findById(id);
  if (updateUser === null)
    return res.status(500).json({
      status: res.statusCode,
      message: 'User not found'
    });
  const encryptedPassword = await updateUser.encryptPassword(password);
  await UserSchema.findByIdAndUpdate(id, {
    password: encryptedPassword,
    verified: true
  });
  res.json({
    status: res.statusCode,
    message: 'User updated'
  });
});

export const deleteUser: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const deleteUser = await UserSchema.findByIdAndUpdate(id, {
    isActive: false
  });
  if (deleteUser === null)
    res.json({
      status: res.statusCode,
      message: 'User not found'
    });
  res.json({
    status: res.statusCode,
    message: 'User deleted'
  });
});

export const restoreUser: RequestHandler = catchAsync(
  async (req: CustomRequest, res) => {
    const { id } = req;
    const restoreUser = await UserSchema.findByIdAndUpdate(id, {
      isActive: true
    });
    if (restoreUser === null)
      res.json({
        status: res.statusCode,
        message: 'User not found'
      });
    res.json({
      status: res.statusCode,
      message: 'User restored'
    });
  }
);

export const profile: RequestHandler = catchAsync(
  async (req: CustomRequest, res) => {
    const id = req.id;
    const profile = await UserSchema.findById(id);
    if (profile === null)
      return res.send({
        status: res.statusCode,
        message: 'User not found'
      });

    let user;

    switch (profile.rol) {
      case ROLES.Admin:
        user = await getAdminUser(profile.email);
        break;
      case ROLES.Client:
        user = await getClientUser(profile.email);
        break;
      case ROLES.Seller:
        user = await getSellerUser(profile.email);
        break;
    }

    return res.json({
      status: res.statusCode,
      userId: profile._id,
      rol: profile.rol,
      data: user
    });
  }
);
