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

import { userRoles } from '@utils';

const router = Router();

router
  .route('/')
  .get(
    [verifyRoles([userRoles.Admin, userRoles.Client, userRoles.Seller])],
    getProducts
  )
  .post([verifyRoles([userRoles.Seller])], postProducts);
router
  .route('/:productId')
  .get(
    [verifyRoles([userRoles.Admin, userRoles.Client, userRoles.Seller])],
    getProductById
  )
  .put([verifyRoles([userRoles.Admin, userRoles.Seller])], updateProduct)
  .delete([verifyRoles([userRoles.Admin, userRoles.Seller])], deleteProduct)
  .patch([verifyRoles([userRoles.Admin])], restoreProduct);
router
  .route('/search/:name')
  .get(
    [verifyRoles([userRoles.Admin, userRoles.Seller, userRoles.Client])],
    getProductsByName
  );
router
  .route('/filter/price/:sort')
  .get(
    [verifyRoles([userRoles.Admin, userRoles.Seller, userRoles.Client])],
    sortProductsByPrice
  );
export default router;
