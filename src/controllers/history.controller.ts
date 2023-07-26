import { RequestHandler } from 'express';

import { HistorySchema, UserSchema, OrderSchema } from '@models';

import { logger } from '@config';

export const getHistory: RequestHandler = async (_req, res) => {
  try {
    const history = await HistorySchema.find();
    if (history.length === 0) {
      return res.status(404).json({ message: 'History not found' });
    } else {
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
      res.status(200).json(historyData);
    }
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: { error } });
  }
};

export const getHistoryById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
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
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: { error } });
  }
};

export const createHistory: RequestHandler = async (req, res) => {
  const { userId, orderId, date } = req.body;
  try {
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
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: { error } });
  }
};

export const updateHistory: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { userId, order, date } = req.body;
  try {
    const history = await HistorySchema.findById(id);
    if (history === null) {
      return res.status(404).json({ message: 'History not found' });
    }
    history.userId = userId;
    history.orderId = order;
    history.date = date;
    await history.save();
    return res.status(200).json({ message: 'History updated' });
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: { error } });
  }
};

export const deleteHistory: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const history = await HistorySchema.findById(id);
    if (history === null) {
      return res.status(404).json({ message: 'History not found' });
    }
    await HistorySchema.findByIdAndDelete(id);
    return res.status(200).json({ message: 'History deleted' });
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: { error } });
  }
};
