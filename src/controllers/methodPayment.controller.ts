import { RequestHandler } from 'express';

import { MethodPaymentSchema } from '@models';

import { logger } from '@config';

export const getMethodPayments: RequestHandler = async (_req, res) => {
  try {
    const methods = await MethodPaymentSchema.find();
    return res.status(200).json(methods);
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const getMethodPaymentById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const methodPayment = await MethodPaymentSchema.findById(id);
    return res.status(200).json(methodPayment);
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const createMethodPayment: RequestHandler = async (req, res) => {
  const { name } = req.body;
  try {
    await MethodPaymentSchema.create({ name });
    return res.status(201).json({ message: 'Method payment created' });
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const updateMethodPayment: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    await MethodPaymentSchema.findByIdAndUpdate(id, { name });
    return res.status(200).json({ message: 'Method payment updated' });
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteMethodPayment: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    await MethodPaymentSchema.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Method payment deleted' });
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: (error as Error).message });
  }
};
