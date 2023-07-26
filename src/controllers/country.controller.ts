import { RequestHandler } from 'express';

import { CountrySchema } from '@models';

import { logger } from '@config';

export const getCountry: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const country = await CountrySchema.findById(id);
    if (country == null)
      return res.status(404).json({ message: 'Country not found' });
    res.status(200).json(country);
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const getCountries: RequestHandler = async (_req, res) => {
  try {
    const countries = await CountrySchema.find();
    res.status(200).json(countries);
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const createCountry: RequestHandler = async (req, res) => {
  const { name } = req.body;
  try {
    const newCountry = new CountrySchema({
      name
    });
    const savedCountry = await newCountry.save();
    res.status(201).json(savedCountry);
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const updateCountry: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const updatedCountry = await CountrySchema.findByIdAndUpdate(id, { name });
    if (updatedCountry == null)
      return res.status(404).json({ message: 'Country not found' });
    res.status(200).json({ message: 'Country updated' });
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteCountry: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteCountry = await CountrySchema.findByIdAndDelete(id);
    if (deleteCountry == null)
      return res.status(404).json({ message: 'Country not found' });
    res.status(200).json({ message: 'Country deleted' });
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: (error as Error).message });
  }
};
