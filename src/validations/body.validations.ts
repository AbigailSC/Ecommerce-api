import { body, ValidationChain } from 'express-validator';
// ! This is not used
export const verifyEmail = (): ValidationChain => {
  return body('email')
    .not()
    .trim()
    .isEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email format invalid')
    .normalizeEmail()
    .escape();
};

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
