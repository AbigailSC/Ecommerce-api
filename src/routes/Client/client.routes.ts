import { Router } from 'express';

import {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient
} from '@controllers';

import { verifyRoles } from '@middleware';

import { userRoles } from '@utils';

import { verifyEmail, verifyPhone } from '@validations';

const router = Router();

router
  .route('/')
  .get([verifyRoles([userRoles.Admin])], getClients)
  .post(
    [
      verifyRoles([userRoles.Admin, userRoles.Client]),
      verifyEmail(),
      verifyPhone()
    ],
    createClient
  );
router
  .route('/:id')
  .get([verifyRoles([userRoles.Admin, userRoles.Client])], getClient)
  .put(
    [
      verifyRoles([userRoles.Admin, userRoles.Client]),
      verifyEmail(),
      verifyPhone()
    ],
    updateClient
  )
  .delete([verifyRoles([userRoles.Admin, userRoles.Client])], deleteClient);

export default router;
