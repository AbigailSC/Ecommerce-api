import { RequestHandler } from 'express';

import { HistorySchema, UserSchema, OrderSchema } from '@models';

import { catchAsync } from '@middleware';

export const getHistory: RequestHandler = catchAsync(async (_req, res) => {
  const history = await HistorySchema.find();
  if (history.length === 0) {
    return res.status(404).json({ message: 'History not found' });
  }
  const historyData = await Promise.all(
    history.map(async (history) => {
      const userData = await UserSchema.findById({ _id: history.userId });
      const orderData = await OrderSchema.findById({
        _id: history.orderId
      });
      return {
        ...history.toJSON(),
        user: userData,
        order: orderData
      };
    })
  );
  res.json(historyData);
});

export const getHistoryById: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const history = await HistorySchema.findById(id);
  if (history === null) {
    return res.status(404).json({ message: 'History not found' });
  } else {
    const userData = await UserSchema.findById({ _id: history.userId });
    const orderData = await OrderSchema.findById({
      _id: history.orderId
    });
    return {
      ...history.toJSON(),
      user: userData,
      order: orderData
    };
  }
});

export const createHistory: RequestHandler = catchAsync(async (req, res) => {
  const { userId, orderId, date } = req.body;
  const historyDuplicate = await HistorySchema.findOne({ userId, orderId });
  if (historyDuplicate != null) {
    return res.status(400).json({ message: 'History already exists' });
  }
  const newHistory = new HistorySchema({
    userId,
    orderId,
    date
  });
  const savedHistory = await newHistory.save();
  const userData = await UserSchema.findById({ _id: savedHistory.userId });
  const orderData = await OrderSchema.findById({
    _id: orderId
  });
  return res.status(201).json({
    ...savedHistory.toJSON(),
    user: userData,
    order: orderData
  });
});

export const updateHistory: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { userId, order, date } = req.body;
  const history = await HistorySchema.findById(id);
  if (history === null) {
    return res.status(404).json({ message: 'History not found' });
  }
  history.userId = userId;
  history.orderId = order;
  history.date = date;
  await history.save();
  return res.json({ message: 'History updated' });
});

export const deleteHistory: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const history = await HistorySchema.findById(id);
  if (history === null) {
    return res.status(404).json({ message: 'History not found' });
  }
  await HistorySchema.findByIdAndDelete(id);
  return res.json({ message: 'History deleted' });
});
