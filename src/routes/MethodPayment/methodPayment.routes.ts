import { Router } from 'express';

import {
  getMethodPayments,
  getMethodPaymentById,
  createMethodPayment,
  updateMethodPayment,
  deleteMethodPayment
} from '@controllers';

import { verifyRoles } from '@middleware';

import { userRoles } from '@utils';

const router = Router();

router
  .route('/')
  .get(
    [verifyRoles([userRoles.Admin, userRoles.Client, userRoles.Seller])],
    getMethodPayments
  )
  .post([verifyRoles([userRoles.Admin])], createMethodPayment);
router
  .route('/:productId')
  .get(
    [verifyRoles([userRoles.Admin, userRoles.Client, userRoles.Seller])],
    getMethodPaymentById
  )
  .put([verifyRoles([userRoles.Admin])], updateMethodPayment)
  .delete([verifyRoles([userRoles.Admin])], deleteMethodPayment);

export default router;
