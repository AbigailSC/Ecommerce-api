import { Router } from 'express';

import {
  getFavorites,
  getFavorite,
  createFavorite,
  updateFavorite,
  deleteFavorite
} from '@controllers';

import { userRoles } from '@utils';

import { verifyRoles } from '@middleware';

const router = Router();

router
  .route('/')
  .get([verifyRoles([userRoles.Admin])], getFavorites)
  .post([verifyRoles([userRoles.Client])], createFavorite);
router
  .route('/:id')
  .get([verifyRoles([userRoles.Client, userRoles.Admin])], getFavorite)
  .put([verifyRoles([userRoles.Client])], updateFavorite)
  .delete([verifyRoles([userRoles.Client])], deleteFavorite);

export default router;
