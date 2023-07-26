import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';

import { UserSchema, AdminSchema, ClientSchema, SellerSchema } from '@models';

import { VerifyRefreshToken } from '@middleware';

import { userRoles } from '@utils';

export const createUser: RequestHandler = async (req, res) => {
  const { email, rol } = req.body;
  try {
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
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const getUsers: RequestHandler = async (_req, res) => {
  try {
    const allUsers = await UserSchema.find({ isActive: true });
    allUsers.length > 0
      ? res.json(allUsers)
      : res.send({ message: 'No users found' });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const getUserById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserSchema.findById(id);
    user !== null ? res.json(user) : res.send({ message: 'User not found!' });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const updateUser: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  try {
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
    res.status(200).json({ message: 'User updated' });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteUser: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteUser = await UserSchema.findByIdAndUpdate(id, {
      isActive: false
    });
    deleteUser !== null
      ? res.status(200).json(deleteUser)
      : res.send({ message: 'User not found' });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const restoreUser: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const restoreUser = await UserSchema.findByIdAndUpdate(id, {
      isActive: true
    });
    restoreUser !== null
      ? res.status(200).json(restoreUser)
      : res.send({ message: 'User not found' });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const profile: RequestHandler = async (req: VerifyRefreshToken, res) => {
  const id = req.id;
  try {
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
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};
