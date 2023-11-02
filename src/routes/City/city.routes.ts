import { Router } from 'express';

import {
  getCity,
  getCities,
  createCity,
  updateCity,
  deleteCity
} from '@controllers';

import { verifyRoles } from '@middleware';

import { ROLES } from '@constants';

import { verifyIdParam, verifyName } from '@validations';

const router = Router();

router
  .route('/')
  .get([verifyRoles([ROLES.Admin, ROLES.Client, ROLES.Seller])], getCities)
  .post([verifyRoles([ROLES.Admin]), ...verifyName], createCity);
router
  .route('/:id')
  .get(
    [verifyRoles([ROLES.Admin, ROLES.Client, ROLES.Seller]), ...verifyIdParam],
    getCity
  )
  .put([verifyRoles([ROLES.Admin]), ...verifyName], updateCity)
  .delete([verifyRoles([ROLES.Admin])], deleteCity);

export default router;
