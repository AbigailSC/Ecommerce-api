import { Router } from 'express';

import {
  getCity,
  getCities,
  createCity,
  updateCity,
  deleteCity
} from '@controllers';

import { verifyRoles } from '@middleware';

import { userRoles } from '@utils';

const router = Router();

router
  .route('/')
  .get(
    [verifyRoles([userRoles.Admin, userRoles.Client, userRoles.Seller])],
    getCities
  )
  .post([verifyRoles([userRoles.Admin])], createCity);
router
  .route('/:id')
  .get(
    [verifyRoles([userRoles.Admin, userRoles.Client, userRoles.Seller])],
    getCity
  )
  .put([verifyRoles([userRoles.Admin])], updateCity)
  .delete([verifyRoles([userRoles.Admin])], deleteCity);

export default router;
