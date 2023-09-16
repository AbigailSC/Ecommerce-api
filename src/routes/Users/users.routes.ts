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

import { check } from 'express-validator';

const router: Router = Router();

router
  .route('/')
  .get([verifyRoles([userRoles.Admin])], getUsers)
  .post(
    [
      verifyRoles([userRoles.Admin, userRoles.Client, userRoles.Seller]),
      check('email', 'Email is required').not().isEmpty(),
      check('email').isEmail().withMessage('Email format invalid'),
      check('email').normalizeEmail().escape(),
      check('password', 'Password is required').not().isEmpty(),
      check(
        'password',
        'Password should have at least 8 chars, 1 lowercase, 1 uppercase, 1 number, 1 symbol'
      ).isStrongPassword(),
      check('rol', 'Rol is required').not().isEmpty(),
      recolectErrors
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
    [verifyRoles([userRoles.Admin, userRoles.Client, userRoles.Seller])],
    getUserById
  )
  .put(
    [
      verifyRoles([userRoles.Admin]),
      check('password', 'Password is required').not().isEmpty()
    ],
    updateUser
  )
  .delete([verifyRoles([userRoles.Admin])], deleteUser)
  .patch([verifyRoles([userRoles.Admin])], restoreUser);

export default router;
