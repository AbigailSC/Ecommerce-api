import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';

import {
  CustomResponseCookie,
  generateRefreshToken,
  generateToken,
  logger
} from '@config';

import { VerifyRefreshToken, catchAsync } from '@middleware';

import { UserSchema } from '@models';
import {
  messageEmailActivated,
  messageEmailAlreadyVerified,
  messageEmailNotFound,
  messageForgotPassword,
  messageResetPassword,
  messageTokenExpired
} from '@utils';

export const singIn: RequestHandler = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  const userFound = await UserSchema.findOne({ email });
  if (userFound === null) {
    return res.status(404).json({
      message: messageEmailNotFound(email)
    });
  }
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  if (!userFound.verified)
    return res.status(401).json({ msg: 'User not verified' });
  const matchPassword = await userFound.comparePassword(password);
  if (!matchPassword) return res.status(401).json({ msg: 'Invalid password' });
  generateRefreshToken(userFound._id, res as unknown as CustomResponseCookie);
  return res.status(200).json({ message: 'Log in successfully' });
});

export const logOut: RequestHandler = catchAsync(async (_req, res) => {
  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'Log out successfully' });
});

export const refreshToken: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req as VerifyRefreshToken;
  if (id === undefined) throw new Error('No id provided');
  const { token, expiresIn } = generateToken(id);
  return res.status(200).json({ token, expiresIn });
});

export const verify: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userFound = await UserSchema.findById(id);
  if (userFound === null)
    return res.status(404).json({ message: 'User not found' });
  const { token, expiresIn } = generateToken(userFound._id);
  return res.status(200).json({ token, expiresIn });
});

export const forgotPassword: RequestHandler = catchAsync(async (req, res) => {
  interface RequestBody {
    email: string;
  }
  const { email } = req.body as RequestBody;
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  const user = await UserSchema.findOne({ email });
  if (user === null)
    return res.status(500).json({
      message: messageEmailNotFound(email)
    });
  const { token, expiresIn } = generateToken(user._id);

  await user.updateOne({ resetPasswordTokenLink: token, expiresIn });
  return res.json({
    message: messageForgotPassword(email)
  });
});

export const resetPassword: RequestHandler = catchAsync(async (req, res) => {
  const { resetPasswordTokenLink, newPassword } = req.body;
  const user = await UserSchema.findOne({ resetPasswordTokenLink });
  if (user === null) return res.status(500).json({ message: 'User not found' });
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  if (user.resetPasswordTokenLink === '')
    return res.status(500).json({ message: 'Invalid Link' });
  const encryptedPassword = await user.encryptPassword(newPassword);
  const updatedUser = {
    password: encryptedPassword,
    resetPasswordTokenLink: ''
  };
  await user.updateOne(updatedUser);
  res.json({
    message: messageResetPassword()
  });
});

export const emailVerify: RequestHandler = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  const user = await UserSchema.findOne({ emailVerificationToken: token });
  if (user === null) return res.status(500).json({ message: 'User not found' });
  if (user.emailVerifyTokenLink === '')
    return res.status(500).json({
      message: messageTokenExpired()
    });
  user.emailVerifyTokenLink = '';
  await user.updateOne(user);
  res.json({
    message: 'Email verified! Now you can login with your new password.'
  });
});

export const activateAccount: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  if (password === undefined)
    return res.status(500).json({ message: 'Password is required.' });
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  const user = await UserSchema.findById(id);
  if (user === null)
    return res.status(500).json({ message: 'User not found.' });
  if (user.verified)
    return res.status(500).json({
      message: messageEmailAlreadyVerified()
    });

  const encryptedPassword = await user.encryptPassword(password);
  await UserSchema.findByIdAndUpdate(id, {
    password: encryptedPassword,
    verified: true
  });

  res.json({
    message: messageEmailActivated()
  });
});
