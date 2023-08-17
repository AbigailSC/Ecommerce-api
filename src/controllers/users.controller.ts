import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';

import { UserSchema, AdminSchema, ClientSchema, SellerSchema } from '@models';

import { VerifyRefreshToken, catchAsync } from '@middleware';

import { userRoles } from '@utils';

export const createUser: RequestHandler = catchAsync(async (req, res) => {
  const { email, rol } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  const newUser = new UserSchema({
    email,
    rol,
    emailVerifyTokenLink: req.cookies.refreshToken
  });
  const savedUser = await newUser.save();
  return res.status(201).json(savedUser);
});

export const getUsers: RequestHandler = catchAsync(async (_req, res) => {
  const allUsers = await UserSchema.find({ isActive: true });
  if (allUsers.length === 0) res.json({ message: 'No users found' });
  res.json(allUsers);
});

export const getUserById: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;

  const user = await UserSchema.findById(id);
  if (user === null) res.json({ message: 'User not found!' });
  res.json(user);
});

export const updateUser: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  if (password === undefined)
    return res.status(400).json({ message: 'Password is required' });
  const updateUser = await UserSchema.findById(id);
  if (updateUser === null)
    return res.status(500).json({ message: 'User not found' });
  const encryptedPassword = await updateUser.encryptPassword(password);
  await UserSchema.findByIdAndUpdate(id, {
    password: encryptedPassword,
    verified: true
  });
  res.json({ message: 'User updated' });
});

export const deleteUser: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const deleteUser = await UserSchema.findByIdAndUpdate(id, {
    isActive: false
  });
  if (deleteUser === null) res.json({ message: 'User not found' });
  res.json(deleteUser);
});

export const restoreUser: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const restoreUser = await UserSchema.findByIdAndUpdate(id, {
    isActive: true
  });
  if (restoreUser === null) res.json({ message: 'User not found' });
  res.json(restoreUser);
});

export const profile: RequestHandler = catchAsync(
  async (req: VerifyRefreshToken, res) => {
    const id = req.id;
    const profile = await UserSchema.findById(id);
    if (profile === null) return res.send({ message: 'User not found' });
    if (profile.rol === userRoles.Admin) {
      const adminUser = await AdminSchema.findOne({ email: profile.email });
      return res.json({
        userId: profile._id,
        rol: profile.rol,
        data: adminUser
      });
    } else if (profile.rol === userRoles.Client) {
      const clientUser = await ClientSchema.findOne({ email: profile.email });
      return res.json({
        userId: profile._id,
        rol: profile.rol,
        data: clientUser
      });
    } else if (profile.rol === userRoles.Seller) {
      const sellerUser = await SellerSchema.findOne({ email: profile.email });
      return res.json({
        userId: profile._id,
        rol: profile.rol,
        data: sellerUser
      });
    }
  }
);
