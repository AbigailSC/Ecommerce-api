import { Router } from 'express';

import {
  getAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin
} from '@controllers';

import { verifyRoles } from '@middleware';

import { ROLES } from '@constants';

import { verifyPhone } from '@validations';

const router = Router();

router
  .route('/')
  .get(verifyRoles([ROLES.Admin]), getAdmins)
  .post([verifyRoles([ROLES.Admin]), verifyPhone()], createAdmin);
router
  .route('/:id')
  .get([verifyRoles([ROLES.Admin])], getAdminById)
  .put([verifyRoles([ROLES.Admin]), verifyPhone()], updateAdmin)
  .delete([verifyRoles([ROLES.Admin])], deleteAdmin);

export default router;
