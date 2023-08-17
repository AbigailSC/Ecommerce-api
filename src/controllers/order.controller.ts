import { RequestHandler } from 'express';

import {
  ClientSchema,
  MethodPaymentSchema,
  OrderSchema,
  ProductSchema,
  SellerSchema,
  StatusSchema
} from '@models';

import { catchAsync } from '@middleware';

import { calculateAmount } from '@utils';

export const getOrders: RequestHandler = catchAsync(async (_req, res) => {
  const ordersCollection = await OrderSchema.find();
  if (ordersCollection === null)
    return res.status(204).json({ message: 'No content' });
  const ordersData = await Promise.all(
    ordersCollection.map(async (order) => {
      const client = await ClientSchema.findById(order.clientId);
      const methodPayment = await MethodPaymentSchema.findById(
        order.methodPaymentId
      );
      const product = await ProductSchema.findById(order.productId);
      const status = await StatusSchema.findById(order.statusId);
      const seller = await SellerSchema.findById(order.sellerId);
      return {
        ...order.toJSON(),
        clientId: client?.toJSON(),
        methodPaymentId: methodPayment?.toJSON(),
        productId: product?.toJSON(),
        statusId: status?.toJSON(),
        sellerId: seller?.toJSON()
      };
    })
  );
  res.json(ordersData);
});

export const getOrder: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const orderDb = await OrderSchema.findById(id);
  if (orderDb === null)
    return res.status(204).json({ message: 'No order found' });
  const client = await ClientSchema.findById(orderDb.clientId);
  const methodPayment = await MethodPaymentSchema.findById(
    orderDb.methodPaymentId
  );
  const product = await ProductSchema.findById(orderDb.productId);
  const status = await StatusSchema.findById(orderDb.statusId);
  const seller = await SellerSchema.findById(orderDb.sellerId);
  return res.json({
    ...orderDb.toJSON(),
    client: client?.toJSON(),
    methodPayment: methodPayment?.toJSON(),
    product: product?.toJSON(),
    status: status?.toJSON(),
    seller: seller?.toJSON()
  });
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