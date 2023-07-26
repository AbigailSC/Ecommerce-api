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

const router = Router();

router
  .route('/')
  .get(
    [verifyRoles([userRoles.Admin, userRoles.Client, userRoles.Seller])],
    getCountries
  )
  .post([verifyRoles([userRoles.Admin])], createCountry);
router
  .route('/:id')
  .get(
    [verifyRoles([userRoles.Admin, userRoles.Client, userRoles.Seller])],
    getCountry
  )
  .put([verifyRoles([userRoles.Admin])], updateCountry)
  .delete([verifyRoles([userRoles.Admin])], deleteCountry);

export default router;
