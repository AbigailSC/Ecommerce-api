import { Router } from 'express';

import {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient
} from '@controllers';

import { verifyRoles } from '@middleware';

import { ROLES } from '@constants';

import { verifyPhone } from '@validations';

const router = Router();

router
  .route('/')
  .get([verifyRoles([ROLES.Admin])], getClients)
  .post(
    [verifyRoles([ROLES.Admin, ROLES.Client]), verifyPhone()],
    createClient
  );
router
  .route('/:id')
  .get([verifyRoles([ROLES.Admin, ROLES.Client])], getClient)
  .put([verifyRoles([ROLES.Admin, ROLES.Client]), verifyPhone()], updateClient)
  .delete([verifyRoles([ROLES.Admin, ROLES.Client])], deleteClient);

export default router;
