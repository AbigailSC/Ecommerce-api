import { Router } from 'express';

import {
  postProducts,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  restoreProduct,
  getProductsByName,
  sortProductsByPrice
} from '@controllers';

import { verifyRoles } from '@middleware';

import { ROLES } from '@constants';

const router = Router();

router
  .route('/')
  .get([verifyRoles([ROLES.Admin, ROLES.Client, ROLES.Seller])], getProducts)
  .post([verifyRoles([ROLES.Seller])], postProducts);
router
  .route('/:productId')
  .get([verifyRoles([ROLES.Admin, ROLES.Client, ROLES.Seller])], getProductById)
  .put([verifyRoles([ROLES.Admin, ROLES.Seller])], updateProduct)
  .delete([verifyRoles([ROLES.Admin, ROLES.Seller])], deleteProduct)
  .patch([verifyRoles([ROLES.Admin])], restoreProduct);
router
  .route('/search/:name')
  .get(
    [verifyRoles([ROLES.Admin, ROLES.Seller, ROLES.Client])],
    getProductsByName
  );
router
  .route('/filter/price/:sort')
  .get(
    [verifyRoles([ROLES.Admin, ROLES.Seller, ROLES.Client])],
    sortProductsByPrice
  );
export default router;
