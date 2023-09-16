import { RequestHandler } from 'express';

import { CategorySchema } from '@models';

import { catchAsync } from '@middleware';

export const createCategory: RequestHandler = catchAsync(async (req, res) => {
  const { name } = req.body;
  const newCategory = new CategorySchema({
    name
  });
  const savedCategory = await newCategory.save();
  return res.status(201).json({
    status: res.statusCode,
    message: 'Category created',
    data: savedCategory
  });
});

export const getCategories: RequestHandler = catchAsync(async (_req, res) => {
  const categories = await CategorySchema.find().select(
    '-__v -createdAt -updatedAt'
  );
  return res.json({
    status: res.statusCode,
    message: 'Categories found',
    data: categories
  });
});

export const getCategoryById: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const category = await CategorySchema.findById(id).select(
    '-__v -createdAt -updatedAt'
  );
  return res.json({
    status: res.statusCode,
    message: 'Category found',
    data: category
  });
});

export const updateCategory: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const category = await CategorySchema.findById(id);
  if (category === null) {
    return res
      .status(404)
      .json({ status: res.statusCode, message: 'Category not found' });
  }
  category.name = name;
  await category.save();
  return res.json({ status: res.statusCode, message: 'Category updated' });
});

export const deleteCategory: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const category = await CategorySchema.findById(id);
  if (category === null) {
    return res
      .status(404)
      .json({ status: res.statusCode, message: 'Category not found' });
  }
  await category.remove();
  return res.json({ status: res.statusCode, message: 'Category deleted' });
});
