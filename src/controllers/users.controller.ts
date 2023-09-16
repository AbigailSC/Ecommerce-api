import { RequestHandler } from 'express';

import { UserSchema, AdminSchema, ClientSchema, SellerSchema } from '@models';

import { VerifyRefreshToken, catchAsync } from '@middleware';

import { userRoles } from '@utils';
import { UserType } from '@interfaces';

export const createUser: RequestHandler = catchAsync(async (req, res) => {
  const { email, password, rol }: UserType = req.body;
  const newUser = new UserSchema({
    email,
    rol,
    emailVerifyTokenLink: req.cookies.refreshToken
  });
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
  const allUsers = await UserSchema.find({ isActive: true }).select(
    '-password -__v -createdAt -updatedAt'
  );
  if (allUsers.length === 0) res.json({ message: 'No users found' });
  res.json({
    status: res.statusCode,
    message: 'Users found',
    data: allUsers
  });
});

export const getUserById: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = await UserSchema.findById(id).select(
    '-password -__v -createdAt -updatedAt'
  );
  if (user === null) res.json({ message: 'User not found!' });
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

export const restoreUser: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
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
});

export const profile: RequestHandler = catchAsync(
  async (req: VerifyRefreshToken, res) => {
    const id = req.id;
    const profile = await UserSchema.findById(id);
    if (profile === null)
      return res.send({
        status: res.statusCode,
        message: 'User not found'
      });
    if (profile.rol === userRoles.Admin) {
      const adminUser = await AdminSchema.findOne({ email: profile.email })
        .populate('name')
        .populate('lastname')
        .populate({
          path: 'countryId',
          select: 'name -_id'
        })
        .populate({
          path: 'cityId',
          select: 'name -_id'
        })
        .populate('phone')
        .populate('email');
      return res.json({
        status: res.statusCode,
        userId: profile._id,
        rol: profile.rol,
        data: adminUser
      });
    } else if (profile.rol === userRoles.Client) {
      const clientUser = await ClientSchema.findOne({ email: profile.email })
        .populate('name')
        .populate('lastname')
        .populate({
          path: 'countryId',
          select: 'name -_id'
        })
        .populate({
          path: 'cityId',
          select: 'name -_id'
        })
        .populate('phone')
        .populate('email');
      return res.json({
        status: res.statusCode,
        userId: profile._id,
        rol: profile.rol,
        data: clientUser
      });
    } else if (profile.rol === userRoles.Seller) {
      const sellerUser = await SellerSchema.findOne({ email: profile.email })
        .populate('name')
        .populate('lastname')
        .populate({
          path: 'countryId',
          select: 'name -_id'
        })
        .populate({
          path: 'cityId',
          select: 'name -_id'
        })
        .populate('phone')
        .populate('email');
      return res.json({
        status: res.statusCode,
        userId: profile._id,
        rol: profile.rol,
        data: sellerUser
      });
    }
  }
);
