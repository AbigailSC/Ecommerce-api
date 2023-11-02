import { Router } from 'express';

import {
  getSellers,
  getSeller,
  createSeller,
  updateSeller,
  deleteSeller
} from '@controllers';

import { verifyRoles } from '@middleware';

import { ROLES } from '@constants';

import { verifyPhone } from '@validations';

const router: Router = Router();

router
  .route('/')
  .get([verifyRoles([ROLES.Admin])], getSellers)
  .post(
    [verifyRoles([ROLES.Admin, ROLES.Seller]), verifyPhone()],
    createSeller
  );
router
  .route('/:id')
  .get([verifyRoles([ROLES.Admin, ROLES.Seller])], getSeller)
  .put([verifyRoles([ROLES.Admin, ROLES.Seller]), verifyPhone()], updateSeller)
  .delete([verifyRoles([ROLES.Admin])], deleteSeller);

export default router;
