import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';

import {
  CustomResponseCookie,
  generateRefreshToken,
  generateToken,
  logger
} from '@config';

import { VerifyRefreshToken } from '@middleware';

import { UserSchema } from '@models';

export const singIn: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userFound = await UserSchema.findOne({ email });
    if (userFound === null)
      return res.status(404).json({
        message: `The email address ${
          email as string
        } is not associated with any account. Double-check your email address and try again.`
      });

    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    if (!userFound.verified)
      return res.status(401).json({ msg: 'User not verified' });

    const matchPassword = await userFound.comparePassword(password);

    if (!matchPassword)
      return res.status(401).json({ msg: 'Invalid password' });

    // const { token, expiresIn } = generateToken(userFound._id);

    generateRefreshToken(userFound._id, res as unknown as CustomResponseCookie);
    return res.status(200).json({ message: 'Log in successfully' });
    // return res.status(200).json({ token, expiresIn });
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const logOut: RequestHandler = async (_req, res) => {
  try {
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Log out successfully' });
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const refreshToken: RequestHandler = async (req, res) => {
  const { id } = req as VerifyRefreshToken;
  try {
    if (id === undefined) throw new Error('No id provided');
    const { token, expiresIn } = generateToken(id);
    return res.status(200).json({ token, expiresIn });
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const verify: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const userFound = await UserSchema.findById(id);
    if (userFound === null)
      return res.status(404).json({ message: 'User not found' });
    const { token, expiresIn } = generateToken(userFound._id);
    return res.status(200).json({ token, expiresIn });
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const forgotPassword: RequestHandler = async (req, res) => {
  interface RequestBody {
    email: string;
  }
  const { email } = req.body as RequestBody;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const user = await UserSchema.findOne({ email });
    if (user === null)
      return res.status(500).json({
        message: `The email address ${email} is not associated with any account. Double-check your email address and try again.`
      });
    const { token, expiresIn } = generateToken(user._id);

    await user.updateOne({ resetPasswordTokenLink: token, expiresIn });
    return res.status(200).json({
      message: `Auth success. An Email with Reset password link has been sent to your account ${user.email}  please check to rest your password or use the the link which is been send with the response body to rest your password`
    });
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const resetPassword: RequestHandler = async (req, res) => {
  const { resetPasswordTokenLink, newPassword } = req.body;
  try {
    const user = await UserSchema.findOne({ resetPasswordTokenLink });
    if (user === null)
      return res.status(500).json({ message: 'User not found' });

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
    res.status(200).json({
      message: `Your password has been successfully updated please login`
    });
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const emailVerify: RequestHandler = async (req, res) => {
  const token = req.headers.authorization;
  try {
    const user = await UserSchema.findOne({ emailVerificationToken: token });
    if (user === null)
      return res.status(500).json({ message: 'User not found' });
    if (user.emailVerifyTokenLink === '')
      return res.status(500).json({
        message:
          'Email verification token is invalid or has expired. Please click on resend for verify your Email.'
      });
    user.emailVerifyTokenLink = '';
    await user.updateOne(user);
    res.status(200).json({
      message: 'Email verified! Now you can login with your new password.'
    });
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const activateAccount: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  try {
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
        message: `Your email has already been verified. Please Login.`
      });

    const encryptedPassword = await user.encryptPassword(password);
    await UserSchema.findByIdAndUpdate(id, {
      password: encryptedPassword,
      verified: true
    });

    res.status(200).json({
      message: 'Account activated! Now you can login with your new password.'
    });
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: (error as Error).message });
  }
};
