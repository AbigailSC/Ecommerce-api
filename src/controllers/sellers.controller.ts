import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';

import {
  CitySchema,
  CountrySchema,
  RolSchema,
  SellerSchema,
  UserSchema
} from '@models';

import { catchAsync } from '@middleware';

import { userRoles } from '@utils';

export const getSellers: RequestHandler = catchAsync(async (_req, res) => {
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
  return res.json(sellersData);
});

export const getSeller: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const sellerDb = await SellerSchema.findById(id);
  if (sellerDb === null)
    return res.status(204).json({ message: 'No seller found' });
  const city = await CitySchema.findById(sellerDb.cityId);
  const country = await CountrySchema.findById(sellerDb.countryId);
  return res.json({
    ...sellerDb.toJSON(),
    city: city?.toJSON(),
    country: country?.toJSON()
  });
});

export const createSeller: RequestHandler = catchAsync(async (req, res) => {
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
});

export const updateSeller: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name, lastname, address, phone, document, image, countryId, cityId } =
    req.body;
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
  return res.json({ message: 'Seller updated' });
});

export const deleteSeller: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const sellerDb = await SellerSchema.findByIdAndDelete(id);
  if (sellerDb === null)
    return res.status(400).json({ message: 'No seller found' });
  await UserSchema.findOneAndDelete({ email: sellerDb?.email });
  return res.json({ message: 'Seller deleted' });
});
