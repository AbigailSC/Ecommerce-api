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

import { verifyIdParam, verifyName } from '@validations';

const router = Router();

router
  .route('/')
  .get(
    [verifyRoles([userRoles.Admin, userRoles.Client, userRoles.Seller])],
    getCities
  )
  .post([verifyRoles([userRoles.Admin]), ...verifyName], createCity);
router
  .route('/:id')
  .get(
    [
      verifyRoles([userRoles.Admin, userRoles.Client, userRoles.Seller]),
      ...verifyIdParam
    ],
    getCity
  )
  .put([verifyRoles([userRoles.Admin]), ...verifyName], updateCity)
  .delete([verifyRoles([userRoles.Admin])], deleteCity);

export default router;
