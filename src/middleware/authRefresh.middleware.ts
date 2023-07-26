import { DecodedToken } from './auth.middleware';
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { config, logger } from '@config';

export interface VerifyRefreshToken extends Request {
  id?: string;
}

export const verifyRefreshToken = (
  req: VerifyRefreshToken,
  _res: Response,
  next: NextFunction
): void => {
  const { refreshToken } = req.cookies;

  try {
    if (refreshToken === undefined)
      throw new Error('No refresh token provided');
    const { id } = jwt.verify(
      refreshToken,
      config.auth.jwtRefresh
    ) as DecodedToken;
    req.id = id;
    next();
  } catch (error) {
    logger.error((error as Error).message);
    throw new Error('Access denied, you re not Logged In');
  }
};
