import { Router } from 'express';

import {
  getCountry,
  getCountries,
  createCountry,
  updateCountry,
  deleteCountry
} from '@controllers';

import { verifyRoles } from '@middleware';

import { ROLES } from '@constants';

import { verifyIdParam, verifyName } from '@validations';

const router = Router();

router
  .route('/')
  .get([verifyRoles([ROLES.Admin, ROLES.Client, ROLES.Seller])], getCountries)
  .post([verifyRoles([ROLES.Admin]), ...verifyName], createCountry);
router
  .route('/:id')
  .get(
    [verifyRoles([ROLES.Admin, ROLES.Client, ROLES.Seller]), ...verifyIdParam],
    getCountry
  )
  .put([verifyRoles([ROLES.Admin]), ...verifyName], updateCountry)
  .delete([verifyRoles([ROLES.Admin])], deleteCountry);

export default router;
