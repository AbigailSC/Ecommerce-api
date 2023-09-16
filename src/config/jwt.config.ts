import jwt from 'jsonwebtoken';
import { CookieOptions } from 'express';

import { config } from '@config';

interface GenerateToken {
  token: string;
  expiresIn: number;
}

export interface CustomResponseCookie extends Response {
  cookie: (name: string, value: string, options?: CookieOptions) => this;
}

export const generateToken = (id: string): GenerateToken => {
  try {
    const expiresIn = 60 * 30; // 30 minutes
    const token = jwt.sign({ id }, config.auth.jwtSecret, {
      expiresIn
    });
    return { token, expiresIn };
  } catch (error) {
    console.log(error);
    throw new Error('Error generating token');
  }
};

export const generateRefreshToken = (
  id: string,
  res: CustomResponseCookie
): void => {
  try {
    const expiresIn = 60 * 60 * 24 * 7; // 7 days
    const refreshToken = jwt.sign({ id }, config.auth.jwtRefresh, {
      expiresIn
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: expiresIn * 1000,
      secure: config.app.env === 'production',
      expires: new Date(Date.now() + expiresIn * 1000)
    });
  } catch (error) {
    console.log(error);
    throw new Error('Error generating refresh token');
  }
};
