import { Router } from 'express';
import {
  products,
  users,
  category,
  cart,
  clients,
  sellers,
  admins,
  auth,
  city,
  favorites,
  history,
  order
} from '@routes';

const router = Router();

router.use('/admin', admins);
router.use('/auth', auth);
router.use('/cart', cart);
router.use('/categories', category);
router.use('/cities', city);
router.use('/clients', clients);
router.use('/favorites', favorites);
router.use('/history', history);
router.use('/products', products);
router.use('/sellers', sellers);
router.use('/users', users);
router.use('/orders', order);

export default router;
