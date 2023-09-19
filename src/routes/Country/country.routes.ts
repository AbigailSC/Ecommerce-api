import { Router } from 'express';

import {
  getCountry,
  getCountries,
  createCountry,
  updateCountry,
  deleteCountry
} from '@controllers';

import { verifyRoles } from '@middleware';

import { userRoles } from '@utils';

import { verifyIdParam, verifyName } from '@validations';

const router = Router();

router
  .route('/')
  .get(
    [verifyRoles([userRoles.Admin, userRoles.Client, userRoles.Seller])],
    getCountries
  )
  .post([verifyRoles([userRoles.Admin]), ...verifyName], createCountry);
router
  .route('/:id')
  .get(
    [
      verifyRoles([userRoles.Admin, userRoles.Client, userRoles.Seller]),
      ...verifyIdParam
    ],
    getCountry
  )
  .put([verifyRoles([userRoles.Admin]), ...verifyName], updateCountry)
  .delete([verifyRoles([userRoles.Admin])], deleteCountry);

export default router;
