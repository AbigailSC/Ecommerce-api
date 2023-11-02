import { RequestHandler } from 'express';

import { CartSchema } from '@models';

import { catchAsync } from '@middleware';

export const createCart: RequestHandler = catchAsync(async (_req, res) => {
  // const { id: clientId } = req as VerifyRefreshToken;
  // const { products } = req.body;
  // const cartDuplicate = await CartSchema.findOne({ clientId });
  // if (cartDuplicate != null) {
  //   return res
  //     .status(400)
  //     .json({ status: res.statusCode, message: 'Cart already exists' });
  // }
  // const newCart = new CartSchema({
  //   clientId,
  //   products
  // });
  // await newCart.save();
  // return res
  //   .status(201)
  //   .json({ status: res.statusCode, message: 'Cart created' });
  res.send('createCart');
});

export const getCart: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const cart = await CartSchema.findById(id).populate('products.productId');
  if (cart === null) {
    return res
      .status(404)
      .json({ status: res.statusCode, message: 'Cart not found' });
  }
  return res.json({
    status: res.statusCode,
    message: 'Cart found',
    data: cart
  });
});

export const updateCart: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { products } = req.body;
  const cart = await CartSchema.findById(id);
  if (cart === null) {
    return res
      .status(404)
      .json({ status: res.statusCode, message: 'Cart not found' });
  }
  cart.products = products;
  await cart.save();
  return res.json({ status: res.statusCode, message: 'Cart updated' });
});

export const deleteCart: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const cart = await CartSchema.findById(id);
  if (cart === null) {
    return res
      .status(404)
      .json({ status: res.statusCode, message: 'Cart not found' });
  }
  await cart.remove();
  return res.json({ status: res.statusCode, message: 'Cart deleted' });
});

export const getCartByClient: RequestHandler = catchAsync(async (_req, res) => {
  // const { id: clientId } = req as VerifyRefreshToken;
  // const cart = await CartSchema.findOne({ clientId }).populate(
  //   'products.productId'
  // );
  // if (cart === null) {
  //   return res
  //     .status(404)
  //     .json({ status: res.statusCode, message: 'Cart not found' });
  // }
  // return res.json({
  //   status: res.statusCode,
  //   message: 'Cart found',
  //   data: cart
  // });
  res.send('getCartByClient');
});
