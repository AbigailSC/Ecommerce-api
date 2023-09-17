import { Router } from 'express';

import {
  getAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin
} from '@controllers';

import { verifyRoles } from '@middleware';

import { userRoles } from '@utils';

import { verifyPhone } from '@validations';

const router = Router();

router
  .route('/')
  .get(verifyRoles([userRoles.Admin]), getAdmins)
  .post([verifyRoles([userRoles.Admin]), verifyPhone()], createAdmin);
router
  .route('/:id')
  .get([verifyRoles([userRoles.Admin])], getAdminById)
  .put([verifyRoles([userRoles.Admin]), verifyPhone()], updateAdmin)
  .delete([verifyRoles([userRoles.Admin])], deleteAdmin);

export default router;
