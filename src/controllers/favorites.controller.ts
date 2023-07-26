import { RequestHandler } from 'express';

import { FavoriteSchema } from '@models';

import { logger } from '@config';

export const getFavorites: RequestHandler = async (_req, res) => {
  try {
    const favoritesDb = await FavoriteSchema.find();
    return res.status(200).json(favoritesDb);
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: { error } });
  }
};

export const getFavorite: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const favorite = await FavoriteSchema.findById(id);
    return res.status(200).json(favorite);
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: { error } });
  }
};

export const createFavorite: RequestHandler = async (req, res) => {
  const { clientId, products } = req.body;
  try {
    const favoriteDuplicate = await FavoriteSchema.findOne({ clientId });
    if (favoriteDuplicate != null) {
      return res.status(400).json({ message: 'Favorite already exists' });
    }
    const newFavorite = new FavoriteSchema({
      clientId,
      products
    });
    await newFavorite.save();
    return res.status(201).json({ message: 'Favorite added' });
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: { error } });
  }
};

export const updateFavorite: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { clientId, products } = req.body;
  try {
    const updatedFavorite = await FavoriteSchema.findByIdAndUpdate(id, {
      clientId,
      products
    });
    return res.status(200).json(updatedFavorite);
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: { error } });
  }
};

export const deleteFavorite: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedFavorite = await FavoriteSchema.findByIdAndDelete(id);
    return res.status(200).json(deletedFavorite);
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: { error } });
  }
};
