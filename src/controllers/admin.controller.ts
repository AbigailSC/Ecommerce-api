import { RequestHandler } from 'express';

import { AdminSchema, CitySchema, CountrySchema, UserSchema } from '@models';

import { catchAsync } from '@middleware';

import { ROLES } from '@constants';

export const getAdmins: RequestHandler = catchAsync(async (_req, res) => {
  const adminsDb = await AdminSchema.find()
    .populate('cityId', 'name')
    .populate('countryId', 'name')
    .exec();
  if (adminsDb === null)
    return res.status(204).json({
      status: res.statusCode,
      message: 'No content'
    });
  return res.json(adminsDb);
});

export const getAdminById: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const adminDb = await AdminSchema.findById(id)
    .populate('cityId', 'name')
    .populate('countryId', 'name')
    .exec();
  if (adminDb === null)
    return res.status(204).json({
      status: res.statusCode,
      message: 'No content'
    });

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
    return res.status(400).json({
      status: res.statusCode,
      message: 'Admin already exists'
    });

  const newAdmin = new AdminSchema(data);
  await newAdmin.save();

  const adminKey = req.headers['admin-key'] as string;

  if (adminKey === undefined) {
    return res.status(400).json({
      status: res.statusCode,
      message: 'Admin key is required'
    });
  }

  const newUser = new UserSchema({
    email: data.email,
    rol: ROLES.Admin
  });
  await newUser.save();
  return res.status(201).json({
    status: res.statusCode,
    message: 'Admin created'
  });
});

export const updateAdmin: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name, lastname, phone, document, countryId, cityId, image } =
    req.body;
  await AdminSchema.findByIdAndUpdate(id, {
    name,
    lastname,
    phone,
    document,
    countryId,
    cityId,
    image
  });
  res.json({
    status: res.statusCode,
    message: 'Admin updated'
  });
});

export const deleteAdmin: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const admin = await AdminSchema.findByIdAndDelete(id);
  if (admin === null)
    return res.status(204).json({
      status: res.statusCode,
      message: 'Admin not found'
    });
  await UserSchema.findOneAndDelete({ email: admin.email });
  return res.json({
    status: res.statusCode,
    message: 'Admin deleted'
  });
});
