import { Router } from 'express';

import {
  createCart,
  deleteCart,
  getCart,
  updateCart,
  getCartByClient
} from '@controllers';

import { verifyRoles } from '@middleware';

import { ROLES } from '@constants';

const router = Router();

router.route('/client').get([verifyRoles([ROLES.Client])], getCartByClient);
router.route('/').post([verifyRoles([ROLES.Client])], createCart);
router
  .route('/:id')
  .get([verifyRoles([ROLES.Admin, ROLES.Client])], getCart)
  .put([verifyRoles([ROLES.Client])], updateCart)
  .delete([verifyRoles([ROLES.Client])], deleteCart);

export default router;
