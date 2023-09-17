import { Router } from 'express';

import {
  singIn,
  verify,
  forgotPassword,
  resetPassword,
  activateAccount,
  logOut,
  refreshToken
} from '@controllers';

import {
  verifyTokenActivated,
  verifyRefreshToken,
  recolectErrors
} from '@middleware';

import { check } from 'express-validator';

const router = Router();

router.route('/verify/:id').get(verify); // verificamos para obtener el token para recien poder activar la cuenta
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
router.put('/activate/:id', [verifyTokenActivated], activateAccount);
router
  .route('/forgot-password')
  .put(
    [
      verifyRefreshToken,
      check('email', 'Email is required').not().isEmpty(),
      recolectErrors
    ],
    forgotPassword
  );
router
  .route('/reset-password')
  .put(
    [
      verifyRefreshToken,
      check('resetPasswordTokenLink', 'Token Password is required')
        .not()
        .isEmpty(),
      check('newPassword', 'New Password is required').not().isEmpty(),
      recolectErrors
    ],
    resetPassword
  );
// router.route('/activate/:id').put([verifyTokenActivated], activateAccount); // ! This is not used
router.route('/logout').get([verifyRefreshToken], logOut);
router.route('/refresh-token').get([verifyRefreshToken], refreshToken);

export default router;
