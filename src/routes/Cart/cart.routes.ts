import { Router } from 'express';

import {
  createCart,
  deleteCart,
  getCart,
  updateCart,
  getCartByClient
} from '@controllers';

import { verifyRoles } from '@middleware';

import { userRoles } from '@utils';

const router = Router();

router.route('/client').get([verifyRoles([userRoles.Client])], getCartByClient);
router.route('/').post([verifyRoles([userRoles.Client])], createCart);
router
  .route('/:id')
  .get([verifyRoles([userRoles.Admin, userRoles.Client])], getCart)
  .put([verifyRoles([userRoles.Client])], updateCart)
  .delete([verifyRoles([userRoles.Client])], deleteCart);

export default router;
