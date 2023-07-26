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

import { verifyTokenActivated, verifyRefreshToken } from '@middleware';

import { verifyEmail, verifyPassword, verifyIsJWT } from '@validations';

const router = Router();

router.route('/verify/:id').get(verify);
router.route('/signin').post([verifyEmail(), verifyPassword()], singIn);
router.put('/email-verification/:id', [verifyTokenActivated], verify);
router
  .route('/forgot-password')
  .put([verifyTokenActivated, verifyEmail()], forgotPassword);
router
  .route('/reset-password')
  .put([verifyTokenActivated, verifyIsJWT(), verifyEmail()], resetPassword);
router.route('/activate/:id').put([verifyTokenActivated], activateAccount);
router.route('/logout/:id').get([verifyTokenActivated], logOut);
router.route('/refresh-token').get([verifyRefreshToken], refreshToken);

export default router;
