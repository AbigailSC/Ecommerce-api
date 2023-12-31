import { RequestHandler } from 'express';

import { sendEmail } from '@config';

import { ClientSchema, UserSchema } from '@models';

import {
  getActivationTemplate,
  getDuplicateMsg,
  getMessageByRole
} from '@utils';

import { catchAsync } from '@middleware';
import { UserType } from '@interfaces';

export const getClients: RequestHandler = catchAsync(async (_req, res) => {
  const clientsDb = await ClientSchema.find()
    .populate('cityId', 'name')
    .populate('countryId', 'name')
    .populate('cartId', 'products')
    .exec();
  if (clientsDb === null)
    return res.status(204).json({
      status: res.statusCode,
      message: 'No clients found'
    });
  return res.json(clientsDb);
});

export const getClient: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const clientDb = await ClientSchema.findById(id)
    .populate('cityId', 'name')
    .populate('countryId', 'name')
    .populate('cartId', 'products')
    .exec();
  if (clientDb === null)
    return res.status(204).json({
      status: res.statusCode,
      message: 'Client not found'
    });
  return res.json(clientDb);
});

export const createClient: RequestHandler = catchAsync(async (req, res) => {
  const data = req.body;
  const clientDuplicate = await ClientSchema.findOne({ email: data.email });
  if (clientDuplicate !== null)
    return res.status(400).json({
      status: res.statusCode,
      message: getDuplicateMsg(data.email)
    });
  const newClient = new ClientSchema(data);
  await newClient.save();
  const newUser: UserType = new UserSchema({
    email: data.email
  });
  await newUser.save();
  await sendEmail(
    'sv56r.test@inbox.testmail.app',
    'Activate account',
    getActivationTemplate(newUser.emailVerifyTokenLink)
  );
  res.status(201).json({
    status: res.statusCode,
    message: getMessageByRole(newUser.rol, data.email)
  });
});

export const updateClient: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name, lastname, address, phone, countryId, cityId, image } = req.body;
  await ClientSchema.findByIdAndUpdate(id, {
    name,
    lastname,
    address,
    phone,
    countryId,
    cityId,
    image
  });
  res.json({
    status: res.statusCode,
    message: 'Client updated'
  });
});

export const deleteClient: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const client = await ClientSchema.findByIdAndDelete(id);
  if (client === null)
    return res.status(400).json({ message: 'Client not found' });
  await UserSchema.findOneAndDelete({ email: client.email });
  res.json({
    status: res.statusCode,
    message: 'Client deleted'
  });
});
