import { Router } from 'express';

import {
  getHistory,
  getHistoryById,
  createHistory,
  updateHistory,
  deleteHistory
} from '@controllers';

import { verifyRoles } from '@middleware';

import { ROLES } from '@constants';

const router = Router();

router
  .route('/')
  .get([verifyRoles([ROLES.Admin])], getHistory)
  .post([verifyRoles([ROLES.Client])], createHistory);
router
  .route('/:id')
  .get([verifyRoles([ROLES.Admin, ROLES.Client])], getHistoryById)
  .put([verifyRoles([ROLES.Client])], updateHistory)
  .delete([verifyRoles([ROLES.Client])], deleteHistory);

export default router;
