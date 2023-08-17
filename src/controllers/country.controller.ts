import { RequestHandler } from 'express';

import { CountrySchema } from '@models';

import { catchAsync } from '@middleware';

export const getCountry: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const country = await CountrySchema.findById(id);
  if (country == null)
    return res.status(404).json({ message: 'Country not found' });
  res.json(country);
});

export const getCountries: RequestHandler = catchAsync(async (_req, res) => {
  const countries = await CountrySchema.find();
  res.json(countries);
});

export const createCountry: RequestHandler = catchAsync(async (req, res) => {
  const { name } = req.body;
  const newCountry = new CountrySchema({
    name
  });
  const savedCountry = await newCountry.save();
  res.status(201).json(savedCountry);
});

export const updateCountry: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const updatedCountry = await CountrySchema.findByIdAndUpdate(id, { name });
  if (updatedCountry == null)
    return res.status(404).json({ message: 'Country not found' });
  res.json({ message: 'Country updated' });
});

export const deleteCountry: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const deleteCountry = await CountrySchema.findByIdAndDelete(id);
  if (deleteCountry == null)
    return res.status(404).json({ message: 'Country not found' });
  res.json({ message: 'Country deleted' });
});
