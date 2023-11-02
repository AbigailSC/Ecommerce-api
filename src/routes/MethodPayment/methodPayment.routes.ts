import { Router } from 'express';

import {
  getMethodPayments,
  getMethodPaymentById,
  createMethodPayment,
  updateMethodPayment,
  deleteMethodPayment
} from '@controllers';

import { verifyRoles } from '@middleware';

import { ROLES } from '@constants';

const router = Router();

router
  .route('/')
  .get(
    [verifyRoles([ROLES.Admin, ROLES.Client, ROLES.Seller])],
    getMethodPayments
  )
  .post([verifyRoles([ROLES.Admin])], createMethodPayment);
router
  .route('/:productId')
  .get(
    [verifyRoles([ROLES.Admin, ROLES.Client, ROLES.Seller])],
    getMethodPaymentById
  )
  .put([verifyRoles([ROLES.Admin])], updateMethodPayment)
  .delete([verifyRoles([ROLES.Admin])], deleteMethodPayment);

export default router;
