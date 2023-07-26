import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';

import { logger, sendEmail } from '@config';

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
  getMessageByRole
} from '@utils';

export const getClients: RequestHandler = async (_req, res) => {
  try {
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
    return res.status(200).json(clientsData);
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: { error } });
  }
};

export const getClient: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const clientDb = await ClientSchema.findById(id);
    if (clientDb === null)
      return res.status(204).json({ message: 'No client found' });

    const cart = await CartSchema.find({
      client: clientDb._id
    });
    const city = await CitySchema.findById(clientDb.cityId);
    const country = await CountrySchema.findById(clientDb.countryId);
    return res.status(200).json({
      ...clientDb.toJSON(),
      city: city?.toJSON(),
      country: country?.toJSON(),
      cart
    });
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: { error } });
  }
};

export const createClient: RequestHandler = async (req, res) => {
  const { name, lastname, address, phone, email, countryId, cityId, image } =
    req.body;
  try {
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

    const rol = await RolSchema.findOne({ name: 'Client' });

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
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const updateClient: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { name, lastname, address, phone, countryId, cityId, image } = req.body;
  try {
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
    res.status(200).json({ message: 'Client updated' });
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteClient: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const client = await ClientSchema.findByIdAndDelete(id);
    if (client === null)
      return res.status(400).json({ message: 'Client not found' });
    await UserSchema.findOneAndDelete({ email: client?.email });
    res.status(200).json({ message: 'Client deleted' });
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: (error as Error).message });
  }
};
