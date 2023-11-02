import { Router } from 'express';

import {
  singIn,
  verifyAccount,
  forgotPassword,
  resetPassword,
  desactivateAccount,
  logOut,
  refreshToken
} from '@controllers';

import {
  recolectErrors,
  verifyRefreshToken,
  verifyUserIsAlreadyVerified
} from '@middleware';

import { check } from 'express-validator';

const router = Router();

router.route('/verify').get([verifyUserIsAlreadyVerified], verifyAccount); // ? verificamos para obtener el token para recien poder activar la cuenta, tal vez no es necesario, deberia crear la cuenta y luego verificarla desde el email, cambiar esto a una funcion
router
  .route('/signin')
  .post(
    [
      check('password', 'Password is required').not().isEmpty(),
      check('email', 'Email is required').not().isEmpty(),
      recolectErrors
    ],
    singIn
  );
router.put('/desactivate/:id', desactivateAccount); // Activar cuenta baneada o inactiva
router
  .route('/forgot-password')
  .put(
    [check('email', 'Email is required').not().isEmpty(), recolectErrors],
    forgotPassword
  );
router.route('/reset-password').put(
  [
    verifyRefreshToken, //! maybe not needed the token? si reseteo la pass es porque no puedo loguearme
    check('newPassword', 'New Password is required').not().isEmpty(),
    recolectErrors
  ],
  resetPassword
);
// router.route('/activate/:id').put([verifyTokenActivated], activateAccount); // ! This is not used
router.route('/logout').get([verifyRefreshToken], logOut);
router.route('/refresh-token').get([verifyRefreshToken], refreshToken);

export default router;
