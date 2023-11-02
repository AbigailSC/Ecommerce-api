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

import {
  recolectErrors,
  verifyRefreshToken,
  verifyRoles,
  verifyUserIsNotActivated
} from '@middleware';

import { ROLES } from '@constants';

import { check, param } from 'express-validator';
import { verifyCreate } from '@validations';

const router: Router = Router();

router
  .route('/')
  .get(
    [verifyRefreshToken, verifyUserIsNotActivated, verifyRoles([ROLES.Admin])],
    getUsers
  )
  .post([...verifyCreate, recolectErrors], createUser);
router
  .route('/profile')
  .get(
    [
      verifyRefreshToken,
      verifyUserIsNotActivated,
      verifyRoles([ROLES.Admin, ROLES.Client, ROLES.Seller])
    ],
    profile
  );
router
  .route('/:id')
  .get(
    [
      verifyRefreshToken,
      verifyUserIsNotActivated,
      verifyRoles([ROLES.Admin, ROLES.Client, ROLES.Seller]),
      param('id', 'Id format invalid').isMongoId(),
      recolectErrors
    ],

    getUserById
  )
  .put(
    [
      verifyRefreshToken,
      verifyUserIsNotActivated,
      verifyRoles([ROLES.Admin]),
      param('id', 'Id format invalid').isMongoId(),
      check('password', 'Password is required').not().isEmpty(),
      recolectErrors
    ],
    updateUser
  )
  .delete(
    [
      verifyRefreshToken,
      verifyUserIsNotActivated,
      verifyRoles([ROLES.Admin]),
      param('id', 'Id format invalid').isMongoId(),
      recolectErrors
    ],
    deleteUser
  )
  .patch(
    [
      verifyRefreshToken,
      verifyUserIsNotActivated,
      verifyRoles([ROLES.Admin]),
      param('id', 'Id format invalid').isMongoId(),
      recolectErrors
    ],
    restoreUser
  );

export default router;
