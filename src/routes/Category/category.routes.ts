import { Router } from 'express';

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
  getCategoryById
} from '@controllers';

import { recolectErrors, verifyRoles } from '@middleware';

import { userRoles } from '@utils';
import { verifyIdParam, verifyName } from '@validations';

const router = Router();

router
  .route('/')
  .get(
    [verifyRoles([userRoles.Admin, userRoles.Client, userRoles.Seller])],
    getCategories
  )
  .post([verifyRoles([userRoles.Admin]), ...verifyName], createCategory);
router
  .route('/:id')
  .get(
    [
      verifyRoles([userRoles.Admin, userRoles.Client, userRoles.Seller]),
      ...verifyIdParam
    ],
    getCategoryById
  )
  .put(
    [verifyRoles([userRoles.Admin]), ...verifyName, recolectErrors],
    updateCategory
  )
  .delete([verifyRoles([userRoles.Admin])], deleteCategory);
// uwu
export default router;
