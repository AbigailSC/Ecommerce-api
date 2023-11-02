import { Router } from 'express';

import { getOrders, getOrder, createOrder } from '@controllers';

import { verifyRoles } from '@middleware';

import { ROLES } from '@constants';

const router = Router();

router
  .route('/')
  .get([verifyRoles([ROLES.Admin])], getOrders)
  .post([verifyRoles([ROLES.Admin, ROLES.Client])], createOrder);
router
  .route('/:id')
  .get([verifyRoles([ROLES.Admin, ROLES.Seller, ROLES.Client])], getOrder);

export default router;
