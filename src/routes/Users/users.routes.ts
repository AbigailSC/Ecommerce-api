import { Router } from 'express';

import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  restoreUser,
  profile
} from '@controllers';

import { recolectErrors, verifyRoles } from '@middleware';

import { userRoles } from '@utils';

import { check, param } from 'express-validator';
import { verifyCreate } from '@validations';

const router: Router = Router();

router
  .route('/')
  .get([verifyRoles([userRoles.Admin])], getUsers)
  .post(
    [
      verifyRoles([userRoles.Admin, userRoles.Client, userRoles.Seller]),
      ...verifyCreate
    ],
    createUser
  );
router
  .route('/profile')
  .get(
    [verifyRoles([userRoles.Admin, userRoles.Client, userRoles.Seller])],
    profile
  );
router
  .route('/:id')
  .get(
    [
      verifyRoles([userRoles.Admin, userRoles.Client, userRoles.Seller]),
      param('id', 'Id format invalid').isMongoId(),
      recolectErrors
    ],

    getUserById
  )
  .put(
    [
      verifyRoles([userRoles.Admin]),
      param('id', 'Id format invalid').isMongoId(),
      check('password', 'Password is required').not().isEmpty(),
      recolectErrors
    ],
    updateUser
  )
  .delete(
    [
      verifyRoles([userRoles.Admin]),
      param('id', 'Id format invalid').isMongoId(),
      recolectErrors
    ],
    deleteUser
  )
  .patch(
    [
      verifyRoles([userRoles.Admin]),
      param('id', 'Id format invalid').isMongoId(),
      recolectErrors
    ],
    restoreUser
  );

export default router;
