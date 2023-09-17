import jwt from 'jsonwebtoken';
import { RequestHandler, Request } from 'express';
import { UserSchema } from '@models';
import { config, logger } from '@config';
import { messageEmailAlreadyVerified } from '@utils';

export interface CustomRequest extends Request {
  id?: string;
}

export interface DecodedToken {
  id: string;
}

export const verifyTokenActivated: RequestHandler = async (
  req: CustomRequest,
  res,
  next
) => {
  const token =
    typeof req.headers.authorization === 'string'
      ? req.headers.authorization
      : '';
  try {
    if (token.length === 0)
      return res
        .status(401)
        .json({ status: res.statusCode, message: 'You need to enter a token' });
    const decoded: DecodedToken = jwt.verify(
      token,
      config.auth.jwtSecret
    ) as DecodedToken;
    const user = await UserSchema.findById(decoded.id, {
      password: 0
    });
    console.log('🚀 ~ file: auth.middleware.ts:33 ~ user:', user);

    if (user === null)
      return res.status(404).json({
        status: res.statusCode,
        message: 'No user found'
      });
    if (user.verified)
      return res.status(401).json({
        status: res.statusCode,
        message: messageEmailAlreadyVerified()
      });
    if (!user.isActive)
      return res.status(401).json({
        status: res.statusCode,
        message: 'Account is not active'
      });
    req.id = decoded.id;
    next();
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(401).json({
      status: res.statusCode,
      message: 'Access denied, you re not Logged In'
    });
  }
};

export const verifyRoles: (roles: string[]) => RequestHandler =
  (roles) => async (req: CustomRequest, res, next) => {
    const token =
      typeof req.headers.authorization === 'string'
        ? req.headers.authorization
        : '';
    try {
      if (token.length === 0)
        return res.status(401).json({
          status: res.statusCode,
          message: 'You need to enter a token'
        });
      const decoded: DecodedToken = jwt.verify(
        token,
        config.auth.jwtSecret
      ) as DecodedToken;
      const user = await UserSchema.findById(decoded.id, {
        password: 0
      });
      if (user === null)
        return res.status(404).json({
          status: res.statusCode,
          message: 'No user found'
        });
      if (!roles.includes(user.rol))
        return res.status(401).json({
          status: res.statusCode,
          message: 'Unauthorized'
        });
      req.id = decoded.id;
      next();
    } catch (error) {
      logger.error((error as Error).message);
      return res
        .status(401)
        .json({ status: res.statusCode, message: 'Access denied' });
    }
  };
