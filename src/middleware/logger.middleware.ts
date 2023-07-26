import { RequestHandler, Response } from 'express';
import { logger } from '@config';

export const loggerHTTP: RequestHandler = (req, res, next) => {
  const originalSend = res.send;
  const url = req.url;
  res.send = function <T>(body: T): Response<T> {
    logger.http(`${req.method} ${url} - ${res.statusCode}`);
    return originalSend.call(this, body);
  };

  next();
};
