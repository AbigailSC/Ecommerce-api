import { RequestHandler } from 'express';

import { generateToken, getCredentialsRefreshToken } from '@config';

import { catchAsync } from '@middleware';

import { UserSchema } from '@models';
import {
  messageEmailDesactivated,
  messageEmailNotFound,
  messageEmailVerified,
  messageForgotPassword,
  messageResetPassword
} from '@utils';

import { CustomRequest } from '@interfaces';

export const singIn: RequestHandler = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const userFound = await UserSchema.findOne({ email });
  if (userFound === null) {
    return res.status(404).json({
      status: res.statusCode,
      message: messageEmailNotFound(email)
    });
  }
  const matchPassword = await userFound.comparePassword(password);
  if (!matchPassword)
    return res
      .status(401)
      .json({ status: res.statusCode, message: 'Invalid password' });

  res.cookie(
    'refreshToken',
    await generateToken(userFound.id),
    getCredentialsRefreshToken()
  );
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

export const refreshToken: RequestHandler = catchAsync(
  async (req: CustomRequest, res) => {
    const { id } = req;
    if (id === undefined) throw new Error('No id provided');
    const token = await generateToken(id);
    return res.json({ token });
  }
);

export const verify: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userFound = await UserSchema.findById(id);
  if (userFound === null)
    return res.status(404).json({ message: 'User not found' });
  const token = await generateToken(userFound._id);
  return res.json(token);
});
// ? verify ya no es necesario, deberia crear la cuenta y luego verificarla desde el email, cambiar esto a una funcion

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
  const token = await generateToken(user._id);

  await user.updateOne({ resetPasswordTokenLink: token });
  return res.json({
    status: res.statusCode,
    message: messageForgotPassword(email)
  });
});

export const resetPassword: RequestHandler = catchAsync(async (req, res) => {
  const { newPassword } = req.body;
  const resetPasswordTokenLink = req.headers['reset-token'];
  const user = await UserSchema.findOne({ resetPasswordTokenLink });
  if (user === null)
    return res
      .status(500)
      .json({ status: res.statusCode, message: 'User not found' });
  if (user.resetPasswordTokenLink === '')
    return res.status(500).json({
      status: res.statusCode,
      message: 'Invalid Token to reset password'
    });
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

export const verifyAccount: RequestHandler = catchAsync(async (req, res) => {
  const token = req.headers['email-verification-token'];
  const user = await UserSchema.findOne({ emailVerifyTokenLink: token });
  if (user === null)
    return res
      .status(500)
      .json({ status: res.statusCode, message: 'User not found' });
  user.emailVerifyTokenLink = '';
  user.verified = true;
  await user.updateOne(user);
  res.json({
    status: res.statusCode,
    message: messageEmailVerified()
  });
});

export const desactivateAccount: RequestHandler = catchAsync(
  async (req, res) => {
    const { id } = req.params;

    await UserSchema.findByIdAndUpdate(id, {
      isActive: false
    });
    res.json({
      status: res.statusCode,
      message: messageEmailDesactivated()
    });
  }
);

// export const desactivateAccount: RequestHandler = catchAsync(
//   async (req: CustomRequest, res) => {
//     const { id } = req;
//     await UserSchema.findByIdAndUpdate(id, {
//       verified: true
//     });
//     res.json({
//       status: res.statusCode,
//       message: messageEmailActivated()
//     });
//   }
// ); // ? THIS VERIFY THE ACCOUNT, NOT USE ANYMORE
