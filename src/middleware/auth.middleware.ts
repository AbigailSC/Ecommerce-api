import { NextFunction, RequestHandler, Response } from 'express';

import { decodedToken, logger } from '@config';
import { CustomRequest, DecodedToken } from '@interfaces';
import { UserSchema } from '@models';
import {
  messageEmailAlreadyActivated,
  messageEmailAlreadyVerified
} from '@utils';

export const verifyUserIsActivated = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const token = req.headers.authorization as string;
  try {
    const decoded = await decodedToken(token);
    const user = await UserSchema.findById(decoded.id);

    if (user === null) {
      return res.status(404).json({
        status: res.statusCode,
        message: 'No user found'
      });
    }

    if (user.isActive) {
      return res.status(401).json({
        status: res.statusCode,
        message: messageEmailAlreadyActivated()
      });
    }

    next();
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(401).json({
      status: res.statusCode,
      message: 'Access denied, you re not Logged In'
    });
  }
};

export const verifyUserIsNotActivated = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const token = req.headers.authorization as string;
  try {
    const decoded = await decodedToken(token);
    const user = await UserSchema.findById(decoded.id);

    if (user === null) {
      return res.status(404).json({
        status: res.statusCode,
        message: 'No user found'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        status: res.statusCode,
        message: 'User is not activated'
      });
    }

    next();
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(401).json({
      status: res.statusCode,
      message: 'Access denied, you re not Logged In'
    });
  }
};

export const verifyUserIsAlreadyVerified = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const token = req.headers['email-verification-token'] as string;

  try {
    const decoded: DecodedToken = await decodedToken(token);
    const user = await UserSchema.findById(decoded.id);

    if (user === null)
      return res.status(404).json({
        status: res.statusCode,
        message: 'No user found'
      });

    if (user.verified && user.emailVerifyTokenLink === '') {
      return res.status(401).json({
        status: res.statusCode,
        message: messageEmailAlreadyVerified()
      });
    }
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
    const token = req.headers.authorization as string;
    try {
      const decoded = await decodedToken(token);

      const user = await UserSchema.findById(decoded.id);

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
