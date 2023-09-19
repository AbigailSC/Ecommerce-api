import { RequestHandler } from 'express';

import { FavoriteSchema } from '@models';

import { catchAsync } from '@middleware';

export const getFavorites: RequestHandler = catchAsync(async (_req, res) => {
  const favoritesDb = await FavoriteSchema.find().populate('clientId');
  return res.json({
    status: res.statusCode,
    message: 'Favorites found',
    data: favoritesDb
  });
});

export const getFavorite: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const favorite = await FavoriteSchema.findById(id).populate(
    'products.productId'
  );
  return res.json(favorite);
});

export const createFavorite: RequestHandler = catchAsync(async (req, res) => {
  const { clientId, products } = req.body;
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
});

export const updateFavorite: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { clientId, products } = req.body;
  const updatedFavorite = await FavoriteSchema.findByIdAndUpdate(id, {
    clientId,
    products
  });
  return res.json(updatedFavorite);
});

export const deleteFavorite: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const deletedFavorite = await FavoriteSchema.findByIdAndDelete(id);
  return res.json(deletedFavorite);
});
