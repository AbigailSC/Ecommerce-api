import { RequestHandler } from 'express';

import { CartSchema } from '@models';

import { logger } from '@config';

export const createCart: RequestHandler = async (req, res) => {
  const { clientId, products } = req.body;
  try {
    const cartDuplicate = await CartSchema.findOne({ clientId });
    if (cartDuplicate != null) {
      return res.status(400).json({ message: 'Cart already exists' });
    }
    const newCart = new CartSchema({
      clientId,
      products
    });
    await newCart.save();

    return res.status(201).json({ message: 'Cart created' });
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: { error } });
  }
};

export const getCart: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await CartSchema.findById(id);
    if (cart === null) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    return res.status(200).json(cart);
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: { error } });
  }
};

export const updateCart: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { products } = req.body;
  try {
    const cart = await CartSchema.findById(id);
    if (cart === null) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    cart.products = products;
    await cart.save();
    return res.status(200).json({ message: 'Cart updated' });
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: { error } });
  }
};

export const deleteCart: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await CartSchema.findById(id);
    if (cart === null) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    await cart.remove();
    return res.status(200).json({ message: 'Cart deleted' });
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).json({ message: { error } });
  }
};
