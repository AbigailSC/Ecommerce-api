import { Router } from 'express';

import {
  getSellers,
  getSeller,
  createSeller,
  updateSeller,
  deleteSeller
} from '@controllers';

import { verifyRoles } from '@middleware';

import { userRoles } from '@utils';

import { verifyPhone } from '@validations';

const router: Router = Router();

router
  .route('/')
  .get([verifyRoles([userRoles.Admin])], getSellers)
  .post(
    [verifyRoles([userRoles.Admin, userRoles.Seller]), verifyPhone()],
    createSeller
  );
router
  .route('/:id')
  .get([verifyRoles([userRoles.Admin, userRoles.Seller])], getSeller)
  .put(
    [verifyRoles([userRoles.Admin, userRoles.Seller]), verifyPhone()],
    updateSeller
  )
  .delete([verifyRoles([userRoles.Admin])], deleteSeller);

export default router;
