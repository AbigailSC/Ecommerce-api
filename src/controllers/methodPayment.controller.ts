import { RequestHandler } from 'express';

import { MethodPaymentSchema } from '@models';

import { catchAsync } from '@middleware';

export const getMethodPayments: RequestHandler = catchAsync(
  async (_req, res) => {
    const methods = await MethodPaymentSchema.find();
    return res.json(methods);
  }
);

export const getMethodPaymentById: RequestHandler = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const methodPayment = await MethodPaymentSchema.findById(id);
    return res.json(methodPayment);
  }
);

export const createMethodPayment: RequestHandler = catchAsync(
  async (req, res) => {
    const { name } = req.body;
    await MethodPaymentSchema.create({ name });
    return res.status(201).json({ message: 'Method payment created' });
  }
);

export const updateMethodPayment: RequestHandler = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    await MethodPaymentSchema.findByIdAndUpdate(id, { name });
    return res.json({ message: 'Method payment updated' });
  }
);

export const deleteMethodPayment: RequestHandler = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    await MethodPaymentSchema.findByIdAndDelete(id);
    return res.json({ message: 'Method payment deleted' });
  }
);
