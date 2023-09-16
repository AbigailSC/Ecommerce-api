import { RequestHandler } from 'express';

import {
  CustomResponseCookie,
  generateRefreshToken,
  generateToken
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
  const userFound = await UserSchema.findOne({ email });
  if (userFound === null) {
    return res.status(404).json({
      status: res.statusCode,
      message: messageEmailNotFound(email)
    });
  }
  if (!userFound.verified)
    return res.status(401).json({ msg: 'User not verified' });
  const matchPassword = await userFound.comparePassword(password);
  if (!matchPassword)
    return res
      .status(401)
      .json({ status: res.statusCode, message: 'Invalid password' });
  generateRefreshToken(userFound._id, res as unknown as CustomResponseCookie);
  return res.json({
    status: res.statusCode,
    message: 'Log in successfully'
  });
});

export const logOut: RequestHandler = catchAsync(async (_req, res) => {
  res.clearCookie('refreshToken');
  res.json({
    status: res.statusCode,
    message: 'Log out successfully'
  });
});

export const refreshToken: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req as VerifyRefreshToken;
  if (id === undefined) throw new Error('No id provided');
  const { token, expiresIn } = generateToken(id);
  return res.json({ token, expiresIn });
});

export const verify: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userFound = await UserSchema.findById(id);
  if (userFound === null)
    return res.status(404).json({ message: 'User not found' });
  const { token, expiresIn } = generateToken(userFound._id);
  return res.json({ token, expiresIn });
}); // ! This is not used

export const forgotPassword: RequestHandler = catchAsync(async (req, res) => {
  interface RequestBody {
    email: string;
  }
  const { email } = req.body as RequestBody;
  const user = await UserSchema.findOne({ email });
  if (user === null)
    return res.status(500).json({
      status: res.statusCode,
      message: messageEmailNotFound(email)
    });
  const { token, expiresIn } = generateToken(user._id);

  await user.updateOne({ resetPasswordTokenLink: token, expiresIn });
  return res.json({
    status: res.statusCode,
    message: messageForgotPassword(email)
  });
});

export const resetPassword: RequestHandler = catchAsync(async (req, res) => {
  const { resetPasswordTokenLink, newPassword } = req.body;
  const user = await UserSchema.findOne({ resetPasswordTokenLink });
  if (user === null)
    return res
      .status(500)
      .json({ status: res.statusCode, message: 'User not found' });
  if (user.resetPasswordTokenLink === '')
    return res
      .status(500)
      .json({ status: res.statusCode, message: 'Invalid Link' });
  const encryptedPassword = await user.encryptPassword(newPassword);
  const updatedUser = {
    password: encryptedPassword,
    resetPasswordTokenLink: ''
  };
  await user.updateOne(updatedUser);
  res.json({
    status: res.statusCode,
    message: messageResetPassword()
  });
});

export const emailVerify: RequestHandler = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  const user = await UserSchema.findOne({ emailVerificationToken: token });
  if (user === null)
    return res
      .status(500)
      .json({ status: res.statusCode, message: 'User not found' });
  if (user.emailVerifyTokenLink === '')
    return res.status(500).json({
      status: res.statusCode,
      message: messageTokenExpired()
    });
  user.emailVerifyTokenLink = '';
  await user.updateOne(user);
  res.json({
    status: res.statusCode,
    message: 'Email verified! Now you can login with your new password.'
  });
});

export const activateAccount: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = await UserSchema.findById(id);
  if (user === null)
    return res
      .status(500)
      .json({ status: res.statusCode, message: 'User not found.' });
  if (user.verified)
    return res.status(500).json({
      status: res.statusCode,
      message: messageEmailAlreadyVerified()
    });
  await UserSchema.findByIdAndUpdate(id, {
    verified: true
  });
  res.json({
    status: res.statusCode,
    message: messageEmailActivated()
  });
});
