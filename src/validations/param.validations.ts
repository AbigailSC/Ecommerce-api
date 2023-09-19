import { recolectErrors } from '@middleware';
import { NextFunction, Request, Response } from 'express';
import { param } from 'express-validator';

export const verifyIdParam = [
  param('id', 'Id is required').not().isEmpty(),
  (req: Request, res: Response, next: NextFunction) => {
    recolectErrors(req, res, next);
  }
];
