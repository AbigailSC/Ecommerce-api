import { body } from 'express-validator';

export const validateOrderBody = [
  body('clientId', 'Client is required').notEmpty(),
  body('methodPaymentId', 'Method payment is required').notEmpty(),
  body('productId', 'Product is required').notEmpty(),
  body('quantity', 'Quantity is required').notEmpty(),
  body('sellerId', 'Seller is required').notEmpty()
];
