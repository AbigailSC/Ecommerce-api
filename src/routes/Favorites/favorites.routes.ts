import { Router } from 'express';

import {
  getFavorites,
  getFavorite,
  createFavorite,
  updateFavorite,
  deleteFavorite
} from '@controllers';

import { ROLES } from '@constants';

import { verifyRoles } from '@middleware';

const router = Router();

router
  .route('/')
  .get([verifyRoles([ROLES.Admin])], getFavorites)
  .post([verifyRoles([ROLES.Client])], createFavorite);
router
  .route('/:id')
  .get([verifyRoles([ROLES.Client, ROLES.Admin])], getFavorite)
  .put([verifyRoles([ROLES.Client])], updateFavorite)
  .delete([verifyRoles([ROLES.Client])], deleteFavorite);

export default router;
