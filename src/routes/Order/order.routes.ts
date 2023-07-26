import { Router } from 'express';

import { getOrders, getOrder, createOrder } from '@controllers';

import { verifyRoles } from '@middleware';

import { userRoles } from '@utils';

const router = Router();

router
  .route('/')
  .get([verifyRoles([userRoles.Admin])], getOrders)
  .post([verifyRoles([userRoles.Admin, userRoles.Client])], createOrder);
router
  .route('/:id')
  .get(
    [verifyRoles([userRoles.Admin, userRoles.Seller, userRoles.Client])],
    getOrder
  );

export default router;
