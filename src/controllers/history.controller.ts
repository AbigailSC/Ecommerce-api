import { RequestHandler } from 'express';

import { HistorySchema } from '@models';

import { catchAsync } from '@middleware';

export const getHistory: RequestHandler = catchAsync(async (_req, res) => {
  const history = await HistorySchema.find()
    .populate('userId', 'email')
    .populate('orderId', 'products')
    .exec();
  if (history.length === 0) {
    return res.status(404).json({ message: 'History not found' });
  }
  res.json(history);
});

export const getHistoryById: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const history = await HistorySchema.findById(id)
    .populate('userId', 'email')
    .populate('orderId', 'products')
    .exec();
  if (history === null) {
    return res.status(404).json({ message: 'History not found' });
  }
  res.json(history);
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
  await newHistory.save();

  return res.status(201).json({
    message: 'History created'
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
