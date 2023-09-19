import { recolectErrors } from '@middleware';
import { NextFunction, Request, Response } from 'express';
import { body, check, ValidationChain } from 'express-validator';

export const verifyCreate = [
  check('email', 'Email is required').exists().not().isEmpty(),
  check('email').isEmail().withMessage('Email format invalid'),
  check('email').normalizeEmail().escape(),
  check('password', 'Password is required').not().isEmpty(),
  check(
    'password',
    'Password should have at least 8 chars, 1 lowercase, 1 uppercase, 1 number, 1 symbol'
  ).isStrongPassword(),
  check('rol', 'Rol is required').not().isEmpty(),
  (req: Request, res: Response, next: NextFunction) => {
    recolectErrors(req, res, next);
  }
];

export const verifyName = [
  check('name', 'Name is required').not().isEmpty(),
  check('name', 'Name must be at least 3 characters').isLength({ min: 3 }),
  check('name', 'Name of category is not a string').isString(),
  (req: Request, res: Response, next: NextFunction) => {
    recolectErrors(req, res, next);
  }
];

export const verifyRol = (): ValidationChain => {
  return body('rol', 'Rol is required').not().isEmpty();
};

export const verifyPassword = (): ValidationChain => {
  return body('password')
    .not()
    .isEmpty()
    .withMessage('Password is required')
    .trim()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .isStrongPassword()
    .withMessage('Password format invalid');
};

export const verifyPhone = (): ValidationChain => {
  return body('phone', 'Phone format invalid')
    .trim()
    .isMobilePhone(['es-AR', 'es-UY'], {
      strictMode: true
    });
};

export const verifyCuitArg = (): ValidationChain => {
  return body('document', 'Passport format invalid').trim().isVAT('AR');
};

export const verifyPassportUy = (): ValidationChain => {
  return body('document', 'Passport format invalid').trim().isVAT('UY');
};

export const verifyIsJWT = (): ValidationChain => {
  return body('resetPasswordTokenLink', 'Token format invalid').trim().isJWT();
};
