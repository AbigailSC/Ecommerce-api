import { RequestHandler } from 'express';

import { CartSchema } from '@models';

import { catchAsync } from '@middleware';

export const createCart: RequestHandler = catchAsync(async (req, res) => {
  const { clientId, products } = req.body;
  const cartDuplicate = await CartSchema.findOne({ clientId });
  if (cartDuplicate != null) {
    return res.status(400).json({ message: 'Cart already exists' });
  }
  const newCart = new CartSchema({
    clientId,
    products
  });
  await newCart.save();

  return res.status(201).json({ message: 'Cart created' });
});

export const getCart: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const cart = await CartSchema.findById(id);
  if (cart === null) {
    return res.status(404).json({ message: 'Cart not found' });
  }
  return res.json(cart);
});

export const updateCart: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { products } = req.body;
  const cart = await CartSchema.findById(id);
  if (cart === null) {
    return res.status(404).json({ message: 'Cart not found' });
  }
  cart.products = products;
  await cart.save();
  return res.json({ message: 'Cart updated' });
});

export const deleteCart: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const cart = await CartSchema.findById(id);
  if (cart === null) {
    return res.status(404).json({ message: 'Cart not found' });
  }
  await cart.remove();
  return res.json({ message: 'Cart deleted' });
});
