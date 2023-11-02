import { Router } from 'express';

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
  getCategoryById
} from '@controllers';

import { recolectErrors, verifyRoles } from '@middleware';

import { ROLES } from '@constants';
import { verifyIdParam, verifyName } from '@validations';

const router = Router();

router
  .route('/')
  .get([verifyRoles([ROLES.Admin, ROLES.Client, ROLES.Seller])], getCategories)
  .post([verifyRoles([ROLES.Admin]), ...verifyName], createCategory);
router
  .route('/:id')
  .get(
    [verifyRoles([ROLES.Admin, ROLES.Client, ROLES.Seller]), ...verifyIdParam],
    getCategoryById
  )
  .put(
    [verifyRoles([ROLES.Admin]), ...verifyName, recolectErrors],
    updateCategory
  )
  .delete([verifyRoles([ROLES.Admin])], deleteCategory);
// uwu
export default router;
