import { logger } from '@config';
import { Request, Response, NextFunction } from 'express';
import { Result, ValidationError, validationResult } from 'express-validator';

type ControllerFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<unknown>;

type CatchAsyncMiddleware = (
  fn: ControllerFunction
) => (req: Request, res: Response, next: NextFunction) => void;

export const catchAsync: CatchAsyncMiddleware =
  (fn) => async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      logger.error((error as Error).message);
      return res.status(500).json({ message: (error as Error).message });
    }
  };

export const recolectErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors: Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  } else {
    next();
  }
};
