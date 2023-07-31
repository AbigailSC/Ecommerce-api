import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';

import {
  CitySchema,
  CountrySchema,
  RolSchema,
  SellerSchema,
  UserSchema
} from '@models';

import { logger } from '@config';
import { userRoles } from '@utils';

export const getSellers: RequestHandler = async (_req, res) => {
  try {
    const sellersDb = await SellerSchema.find();
    if (sellersDb === null)
      return res.status(204).json({ message: 'No content' });
    const sellersData = await Promise.all(
      sellersDb.map(async (seller) => {
        const city = await CitySchema.findById(seller.cityId);
        const country = await CountrySchema.findById(seller.countryId);
        return {
          ...seller.toJSON(),
          city: city?.toJSON(),
          country: country?.toJSON()
        };
      })
    );
    return res.status(200).json(sellersData);
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: { error } });
  }
};

export const getSeller: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const sellerDb = await SellerSchema.findById(id);
    if (sellerDb === null)
      return res.status(204).json({ message: 'No seller found' });

    const city = await CitySchema.findById(sellerDb.cityId);
    const country = await CountrySchema.findById(sellerDb.countryId);

    return res.status(200).json({
      ...sellerDb.toJSON(),
      city: city?.toJSON(),
      country: country?.toJSON()
    });
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: { error } });
  }
};

export const createSeller: RequestHandler = async (req, res) => {
  const {
    name,
    lastname,
    address,
    phone,
    email,
    document,
    image,
    countryId,
    cityId
  } = req.body;
  try {
    const sellerDuplicate = await SellerSchema.findOne({ email });
    if (sellerDuplicate !== null)
      return res.status(400).json({ message: 'Seller already exists' });

    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const newSeller = new SellerSchema({
      name,
      lastname,
      address,
      phone,
      email,
      document,
      image,
      countryId,
      cityId
    });
    await newSeller.save();

    const rol = await RolSchema.findOne({ name: userRoles.Seller });

    const newUser = new UserSchema({
      email,
      rol: rol?.name
    });
    await newUser.save();

    return res.status(201).json({ message: 'Seller created' });
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: { error } });
  }
};

export const updateSeller: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { name, lastname, address, phone, document, image, countryId, cityId } =
    req.body;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    await SellerSchema.findByIdAndUpdate(id, {
      name,
      lastname,
      address,
      phone,
      document,
      countryId,
      cityId,
      image
    });
    return res.status(201).json({ message: 'Seller updated' });
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: { error } });
  }
};

export const deleteSeller: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const sellerDb = await SellerSchema.findByIdAndDelete(id);
    if (sellerDb === null)
      return res.status(400).json({ message: 'No seller found' });
    await UserSchema.findOneAndDelete({ email: sellerDb?.email });
    return res.status(201).json({ message: 'Seller deleted' });
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: { error } });
  }
};
