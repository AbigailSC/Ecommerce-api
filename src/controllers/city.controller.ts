import { RequestHandler } from 'express';

import { CitySchema } from '@models';

import { logger } from '@config';

export const getCity: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const city = await CitySchema.findById(id);
    if (city == null)
      return res.status(404).json({ message: 'City not found' });
    res.status(201).json(city);
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: (error as Error).message });
  }
};

// TODO add error object to catch errors and don't repeat code

export const getCities: RequestHandler = async (_req, res) => {
  try {
    const cities = await CitySchema.find();
    res.status(200).json(cities);
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const createCity: RequestHandler = async (req, res) => {
  const { name, countryId } = req.body;
  try {
    const newCity = new CitySchema({
      name,
      countryId
    });
    const savedCity = await newCity.save();
    res.status(201).json(savedCity);
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const updateCity: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { name, countryId } = req.body;
  try {
    await CitySchema.findByIdAndUpdate(id, {
      name,
      countryId
    });
    res.status(200).json({ message: 'City updated' });
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteCity: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    await CitySchema.findByIdAndDelete(id);
    res.status(200).json({ message: 'City deleted' });
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: (error as Error).message });
  }
};
