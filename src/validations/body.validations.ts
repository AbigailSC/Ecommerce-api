import { body, ValidationChain } from 'express-validator';

export const verifyEmail = (): ValidationChain => {
  return body('email', 'Email invalid')
    .trim()
    .isEmail()
    .normalizeEmail()
    .escape();
};

export const verifyRol = (): ValidationChain => {
  return body('rol', 'Rol is required').not().isEmpty();
};

export const verifyPassword = (): ValidationChain => {
  return body('password', 'Password format invalid')
    .not()
    .trim()
    .isStrongPassword();
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
