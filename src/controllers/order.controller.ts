import { RequestHandler } from 'express';

import { ClientSchema, OrderSchema, ProductSchema } from '@models';

import { catchAsync } from '@middleware';

import { calculateAmount } from '@utils';

export const getOrders: RequestHandler = catchAsync(async (_req, res) => {
  const orders = await OrderSchema.find()
    .populate('clientId')
    .populate('methodPaymentId')
    .populate('productId')
    .populate('statusId')
    .populate('sellerId')
    .exec();
  if (orders === null) return res.status(204).json({ message: 'No content' });
  res.json(orders);
});

export const getOrder: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const orderDb = await OrderSchema.findById(id)
    .populate('clientId')
    .populate('methodPaymentId')
    .populate('productId')
    .populate('statusId')
    .populate('sellerId')
    .exec();
  if (orderDb === null)
    return res.status(204).json({ message: 'No order found' });
  return res.json(orderDb);
});

export const createOrder: RequestHandler = catchAsync(async (req, res) => {
  const { clientId, methodPaymentId, productId, quantity, sellerId } = req.body;
  // ? Maybe we can remove this validation because if the order is duplicated, the client will view the same order
  const client = await ClientSchema.findById(clientId);
  const product = await ProductSchema.findById(productId);
  if (product === null)
    return res.status(400).json({ message: 'Product not found' });
  const orderDb = await OrderSchema.create({
    clientId,
    methodPaymentId,
    productId,
    quantity,
    address: client?.address,
    amount: calculateAmount(product?.price, quantity),
    sellerId
  });
  return res.status(201).json(orderDb);
});

export const updateOrder: RequestHandler = catchAsync(async (req, res) => {
  const { clientId, methodPaymentId, productId, quantity, sellerId } = req.body;
  const { id } = req.params;
  const orderExists = await OrderSchema.findById(id);
  if (orderExists === null)
    return res.status(400).json({ message: 'Order not found' });
  const updateOrder = await OrderSchema.findByIdAndUpdate(id, {
    clientId,
    methodPaymentId,
    productId,
    quantity,
    sellerId
  });
  return res.json(updateOrder);
});
