import { RequestHandler } from 'express';
import { SortOrder } from 'mongoose';

import {
  ProductSchema,
  SellerSchema,
  CategorySchema,
  MethodPaymentSchema
} from '@models';

import { IQuery } from '@interfaces';

import { taxes } from '@utils';

import { catchAsync } from '@middleware';

export const postProducts: RequestHandler = catchAsync(async (req, res) => {
  const {
    name,
    description,
    price,
    stock,
    categoryId,
    sellerId,
    image,
    methodPayment
  } = req.body;
  const productDuplicate = await ProductSchema.findOne({ name, sellerId });
  if (productDuplicate != null) {
    return res.status(400).json({ message: 'Product already exists' });
  }
  const newProduct = new ProductSchema({
    name,
    description,
    price: taxes(price),
    stock,
    image,
    sellerId,
    categoryId,
    methodPayment
  });
  await newProduct.save();
  return res.status(201).json(newProduct);
});

export const getProducts: RequestHandler = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query as IQuery;
  const productsLength: number = await ProductSchema.find({
    isActive: true
  }).count();
  const products = await ProductSchema.find({
    isActive: true,
    isAvailable: true
  })
    .populate('sellerId')
    .populate('categoryId')
    .populate('methodPayment')
    .limit(limit * 1)
    .skip((page - 1) * limit);

  if (products === null)
    return res.status(404).json({ message: 'Products not found' });

  const productsResponse = {
    totalPages: Math.ceil(productsLength / limit),
    currentPage: Number(page),
    hasNextPage: limit * page < productsLength,
    hasPreviousPage: page > 1,
    products
  };
  res.json(productsResponse);
});

export const getProductById: RequestHandler = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const product = await ProductSchema.findById(productId);
  if (product === null)
    return res.status(404).json({ message: 'Product not found' });
  const seller = await SellerSchema.findById(product.sellerId);
  const category = await CategorySchema.findById(product.categoryId);
  const methodPayment = await Promise.all(
    product.methodPayment.map(async (method) => {
      const methods = await MethodPaymentSchema.findById(method);
      return methods?.name;
    })
  );
  return res.json({
    ...product.toJSON(),
    seller: seller?.toJSON(),
    category: category?.toJSON(),
    methodPayment
  });
});

export const getProductsByName: RequestHandler = catchAsync(
  async (req, res) => {
    const { name } = req.params;
    const { page = 1, limit = 10 } = req.query as IQuery;
    const productsLength = await ProductSchema.find({
      isActive: true,
      name: { $regex: name, $options: 'i' }
    }).count();
    const products = await ProductSchema.find({
      isActive: true,
      name: { $regex: name, $options: 'i' }
    })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    if (products.length > 0) {
      res.json({ message: 'Product not found' });
    }
    res.json({
      totalPages: Math.ceil(productsLength / limit),
      currentPage: Number(page),
      hasNextPage: limit * page < productsLength,
      hasPreviousPage: page > 1,
      products
    });
  }
);

export const updateProduct: RequestHandler = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const { name, description, price, stock, image, isAvailable, methodPayment } =
    req.body;
  const product = await ProductSchema.findById(productId);
  if (product === null) res.status(400).json({ message: 'Product not found' });
  const updateProduct = await ProductSchema.findByIdAndUpdate(productId, {
    name,
    description,
    price,
    stock,
    image,
    isAvailable,
    methodPayment
  });
  res.json(updateProduct);
});

export const deleteProduct: RequestHandler = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const deleteProduct = await ProductSchema.findByIdAndUpdate(productId, {
    isActive: false
  });
  if (deleteProduct === null) res.json({ message: 'Product not found' });
  res.json(deleteProduct);
});

export const restoreProduct: RequestHandler = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const restoreProduct = await ProductSchema.findByIdAndUpdate(productId, {
    isActive: true
  });
  if (restoreProduct === null) res.send({ message: 'Product not found' });
  res.json(restoreProduct);
});

export const getProductsByCategory: RequestHandler = catchAsync(
  async (req, res) => {
    const { categoryId } = req.params;
    const { page = 1, limit = 10 } = req.query as IQuery;
    const productsLength = await ProductSchema.find({
      isActive: true,
      categoryId
    }).count();
    const products = await ProductSchema.find({
      isActive: true,
      categoryId
    })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    if (products.length === 0)
      return res.status(404).json({ message: 'Products not found' });
    return res.json({
      totalPages: Math.ceil(productsLength / limit),
      currentPage: Number(page),
      hasNextPage: limit * page < productsLength,
      hasPreviousPage: page > 1,
      products
    });
  }
);

export const getProductsBySeller: RequestHandler = catchAsync(
  async (req, res) => {
    const { sellerId } = req.params;
    const { page = 1, limit = 10 } = req.query as IQuery;
    const productsLength = await ProductSchema.find({
      isActive: true,
      sellerId
    }).count();
    const products = await ProductSchema.find({
      isActive: true,
      sellerId
    })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    if (products.length === 0)
      return res.status(404).json({ message: 'Products not found' });
    return res.json({
      totalPages: Math.ceil(productsLength / limit),
      currentPage: Number(page),
      hasNextPage: limit * page < productsLength,
      hasPreviousPage: page > 1,
      products
    });
  }
);

export const getProductsByMethodPayment: RequestHandler = catchAsync(
  async (req, res) => {
    const { methodPaymentId } = req.params;
    const { page = 1, limit = 10 } = req.query as IQuery;
    const productsLength = await ProductSchema.find({
      isActive: true,
      methodPayment: methodPaymentId
    }).count();
    const products = await ProductSchema.find({
      isActive: true,
      methodPayment: methodPaymentId
    })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    if (products.length === 0)
      return res.status(404).json({ message: 'Products not found' });
    return res.json({
      totalPages: Math.ceil(productsLength / limit),
      currentPage: Number(page),
      hasNextPage: limit * page < productsLength,
      hasPreviousPage: page > 1,
      products
    });
  }
);

export const getProductsByRangePrice: RequestHandler = catchAsync(
  async (req, res) => {
    const { min, max } = req.params;
    const { page = 1, limit = 10 } = req.query as IQuery;
    const productsLength = await ProductSchema.find({
      isActive: true,
      price: { $gte: min, $lte: max }
    }).count();
    const products = await ProductSchema.find({
      isActive: true,
      price: { $gte: min, $lte: max }
    })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    if (products.length === 0)
      return res.status(404).json({ message: 'Products not found' });
    return res.json({
      totalPages: Math.ceil(productsLength / limit),
      currentPage: Number(page),
      hasNextPage: limit * page < productsLength,
      hasPreviousPage: page > 1,
      products
    });
  }
);

export const getProductsByRangePriceAndCategory: RequestHandler = catchAsync(
  async (req, res) => {
    const { min, max, categoryId } = req.params;
    const products = await ProductSchema.find({
      isActive: true,
      price: { $gte: min, $lte: max },
      categoryId
    });
    if (products.length === 0)
      return res.status(404).json({ message: 'Products not found' });
    return res.json(products);
  }
);

export const sortProductsByPrice: RequestHandler = catchAsync(
  async (req, res) => {
    const { sort }: { sort?: SortOrder | { $meta: 'textScore' } } = req.params;
    const { page = 1, limit = 10 } = req.query as IQuery;
    const productsLength = await ProductSchema.find({
      isActive: true
    })
      .sort(sort !== undefined ? { price: sort } : {})
      .count();
    const products = await ProductSchema.find({
      isActive: true
    })
      .sort(sort !== undefined ? { price: sort } : {})
      .limit(limit * 1)
      .skip((page - 1) * limit);
    if (products.length === 0)
      return res.status(404).json({ message: 'Products not found' });
    return res.json({
      totalPages: Math.ceil(productsLength / limit),
      currentPage: Number(page),
      hasNextPage: limit * page < productsLength,
      hasPreviousPage: page > 1,
      products
    });
  }
);

// export const sortProductsByName: RequestHandler = async (req, res) => {
//   try {
//   } catch (error) {
//     return res.status(500).json({ message: (error as Error).message });
//   }
// };

// export const sortProductsByDate: RequestHandler = async (req, res) => {
//   try {
//   } catch (error) {
//     return res.status(500).json({ message: (error as Error).message });
//   }
// };
