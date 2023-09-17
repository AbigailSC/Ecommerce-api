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
import { check, param } from 'express-validator';

const router = Router();

router
  .route('/')
  .get(
    [verifyRoles([userRoles.Admin, userRoles.Client, userRoles.Seller])],
    getCategories
  )
  .post(
    [
      verifyRoles([userRoles.Admin]),
      check('name', 'Name is required').not().isEmpty(),
      check('name', 'Name must be at least 3 characters').isLength({ min: 3 }),
      check('name', 'Name of category is not a string').isString(),
      recolectErrors
    ],
    createCategory
  );
router
  .route('/:id')
  .get(
    [
      verifyRoles([userRoles.Admin, userRoles.Client, userRoles.Seller]),
      param('id', 'Id is required').not().isEmpty()
    ],
    getCategoryById
  )
  .put(
    [
      verifyRoles([userRoles.Admin]),
      check('name', 'Name is required').not().isEmpty(),
      check('name', 'Name must be at least 3 characters').isLength({ min: 3 }),
      check('name', 'Name of category is not a string').isString(),
      recolectErrors
    ],
    updateCategory
  )
  .delete([verifyRoles([userRoles.Admin])], deleteCategory);
// uwu
export default router;
