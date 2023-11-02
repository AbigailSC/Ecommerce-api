import { sign, verify } from 'jsonwebtoken';

import { config } from '@config';
import { CredentialsRefreshToken, DecodedToken } from '@interfaces';

export const generateToken = async (id: string): Promise<string> => {
  const payload = {
    id
  };
  return await new Promise((resolve, reject) => {
    sign(
      payload,
      config.auth.jwtSecret,
      { expiresIn: config.auth.jwtExpires },
      (err: Error | null, token: string | undefined) => {
        if (err) {
          console.log(err);
          reject(new Error('Error generating token'));
        } else {
          resolve(token as string);
        }
      }
    );
  });
};

export const decodedToken = async (token: string): Promise<DecodedToken> => {
  return await new Promise((resolve, reject) => {
    verify(token, config.auth.jwtSecret, (err, decoded) => {
      if (err) {
        console.log(err);
        reject(new Error('Error verifying token'));
      } else {
        resolve(decoded as DecodedToken);
      }
    });
  });
};

export const getCredentialsRefreshToken = (): CredentialsRefreshToken => {
  try {
    const expiresIn = 60 * 60 * 24 * 7; // 7 days
    // const refreshToken = sign({ id }, config.auth.jwtRefresh, {
    //   expiresIn
    // });

    // res.cookie('refreshToken', refreshToken, {
    //   httpOnly: true,
    //   maxAge: expiresIn * 1000,
    //   secure: config.app.env === 'production',
    //   expires: new Date(Date.now() + expiresIn * 1000)
    // });
    return {
      httpOnly: true,
      maxAge: expiresIn * 1000,
      secure: config.app.env === 'production',
      expires: new Date(Date.now() + expiresIn * 1000)
    };
  } catch (error) {
    console.log(error);
    throw new Error('Error creating refresh token credentials');
  }
};
