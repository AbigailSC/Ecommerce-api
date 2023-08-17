import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';

import { sendEmail } from '@config';

import {
  CartSchema,
  CitySchema,
  ClientSchema,
  CountrySchema,
  RolSchema,
  UserSchema
} from '@models';

import {
  getActivationTemplate,
  getDuplicateMsg,
  getMessageByRole,
  userRoles
} from '@utils';

import { catchAsync } from '@middleware';

export const getClients: RequestHandler = catchAsync(async (_req, res) => {
  const clientsDb = await ClientSchema.find();
  if (clientsDb === null)
    return res.status(204).json({ message: 'No content' });
  const clientsData = await Promise.all(
    clientsDb.map(async (client) => {
      const cart = await CartSchema.find({
        client: client._id
      });
      const city = await CitySchema.findById(client.cityId);
      const country = await CountrySchema.findById(client.countryId);
      return {
        ...client.toJSON(),
        city: city?.toJSON(),
        country: country?.toJSON(),
        cart
      };
    })
  );
  return res.json(clientsData);
});

export const getClient: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const clientDb = await ClientSchema.findById(id);
  if (clientDb === null)
    return res.status(204).json({ message: 'No client found' });
  const cart = await CartSchema.find({
    client: clientDb._id
  });
  const city = await CitySchema.findById(clientDb.cityId);
  const country = await CountrySchema.findById(clientDb.countryId);
  return res.json({
    ...clientDb.toJSON(),
    city: city?.toJSON(),
    country: country?.toJSON(),
    cart
  });
});

export const createClient: RequestHandler = catchAsync(async (req, res) => {
  const { name, lastname, address, phone, email, countryId, cityId, image } =
    req.body;
  const clientDuplicate = await ClientSchema.findOne({ email });
  if (clientDuplicate !== null)
    return res.status(400).json({
      message: getDuplicateMsg(email)
    });
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  const newClient = new ClientSchema({
    name,
    lastname,
    address,
    phone,
    email,
    countryId,
    cityId,
    image
  });
  await newClient.save();
  const rol = await RolSchema.findOne({ name: userRoles.Client });
  const newUser = new UserSchema({
    email,
    rol: rol?.name
  });
  await newUser.save();
  await sendEmail(
    'sv56r.test@inbox.testmail.app',
    'Activate account',
    getActivationTemplate(newUser.emailVerifyTokenLink)
  );
  res.status(201).json({
    message: getMessageByRole(newUser.rol, email)
  });
});

export const updateClient: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name, lastname, address, phone, countryId, cityId, image } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  await ClientSchema.findByIdAndUpdate(id, {
    name,
    lastname,
    address,
    phone,
    countryId,
    cityId,
    image
  });
  res.json({ message: 'Client updated' });
});

export const deleteClient: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const client = await ClientSchema.findByIdAndDelete(id);
  if (client === null)
    return res.status(400).json({ message: 'Client not found' });
  await UserSchema.findOneAndDelete({ email: client?.email });
  res.json({ message: 'Client deleted' });
});
