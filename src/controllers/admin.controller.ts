import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';

import {
  AdminSchema,
  CitySchema,
  CountrySchema,
  RolSchema,
  UserSchema
} from '@models';

import { catchAsync } from '@middleware';

import { userRoles } from '@utils';

export const getAdmins: RequestHandler = catchAsync(async (_req, res) => {
  const adminsDb = await AdminSchema.find()
    .populate('cityId', 'name')
    .populate('countryId', 'name')
    .exec();
  if (adminsDb === null) return res.status(204).json({ message: 'No content' });
  return res.json(adminsDb);
});

export const getAdminById: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const adminDb = await AdminSchema.findById(id)
    .populate('cityId', 'name')
    .populate('countryId', 'name')
    .exec();
  if (adminDb === null)
    return res.status(204).json({ message: 'No admin found' });

  const city = await CitySchema.findById(adminDb.cityId);
  const country = await CountrySchema.findById(adminDb.countryId);

  return res.json({
    ...adminDb.toJSON(),
    city: city?.toJSON(),
    country: country?.toJSON()
  });
});

export const createAdmin: RequestHandler = catchAsync(async (req, res) => {
  const data = req.body;
  const adminDuplicate = await AdminSchema.findOne({ email: data.email });
  if (adminDuplicate !== null)
    return res.status(400).json({ message: 'Admin already exists' });
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const newAdmin = new AdminSchema(data);
  await newAdmin.save();
  const rol = await RolSchema.findOne({ name: userRoles.Admin });
  const newUser = new UserSchema({
    email: data.email,
    rol: rol?.name
  });
  await newUser.save();
  return res.status(201).json({ message: 'Admin created' });
});

export const updateAdmin: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name, lastname, phone, document, countryId, cityId, image } =
    req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  await AdminSchema.findByIdAndUpdate(id, {
    name,
    lastname,
    phone,
    document,
    countryId,
    cityId,
    image
  });
  res.json({ message: 'Admin updated' });
});

export const deleteAdmin: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const admin = await AdminSchema.findByIdAndDelete(id);
  if (admin === null)
    return res.status(204).json({ message: 'Admin not found' });
  await UserSchema.findOneAndDelete({ email: admin.email });
  return res.json({ message: 'Admin deleted' });
});
