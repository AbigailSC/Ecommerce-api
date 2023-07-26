import { Router } from 'express';

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
  getCategoryById
} from '@controllers';

import { verifyRoles } from '@middleware';

import { userRoles } from '@utils';

const router = Router();

router
  .route('/')
  .get(
    [verifyRoles([userRoles.Admin, userRoles.Client, userRoles.Seller])],
    getCategories
  )
  .post([verifyRoles([userRoles.Admin])], createCategory);
router
  .route('/:id')
  .get(
    [verifyRoles([userRoles.Admin, userRoles.Client, userRoles.Seller])],
    getCategoryById
  )
  .put([verifyRoles([userRoles.Admin])], updateCategory)
  .delete([verifyRoles([userRoles.Admin])], deleteCategory);

export default router;
