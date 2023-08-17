import { RequestHandler } from 'express';

import { CitySchema } from '@models';

import { catchAsync } from '@middleware';

export const getCity: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const city = await CitySchema.findById(id);
  if (city == null) return res.status(404).json({ message: 'City not found' });
  res.json(city);
});

export const getCities: RequestHandler = catchAsync(async (_req, res) => {
  const cities = await CitySchema.find();
  res.json(cities);
});

export const createCity: RequestHandler = catchAsync(async (req, res) => {
  const { name, countryId } = req.body;
  const newCity = new CitySchema({
    name,
    countryId
  });
  const savedCity = await newCity.save();
  res.status(201).json(savedCity);
});

export const updateCity: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name, countryId } = req.body;
  await CitySchema.findByIdAndUpdate(id, {
    name,
    countryId
  });
  res.status(201).json({ message: 'City updated' });
});

export const deleteCity: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  await CitySchema.findByIdAndDelete(id);
  res.json({ message: 'City deleted' });
});
