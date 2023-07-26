import {
  ProductSchema,
  SellerSchema,
  CategorySchema,
  MethodPaymentSchema
} from '@models';

export const getProductsService = async (
  page: number,
  limit: number
): Promise<any> => {
  const productsLength = await ProductSchema.find({ isActive: true }).count();
  const products = await ProductSchema.find({ isActive: true })
    .limit(limit * 1)
    .skip((page - 1) * limit);
  const productsAvailable = products.filter((product) => product.isAvailable);

  const allProducts = await Promise.all(
    productsAvailable.map(async (product) => {
      const seller = await SellerSchema.findById(product.sellerId);
      const category = await CategorySchema.findById(product.categoryId);
      const methodPayment = await Promise.all(
        product.methodPayment.map(async (method) => {
          const methods = await MethodPaymentSchema.findById(method);
          return methods?.name;
        })
      );
      return {
        ...product.toJSON(),
        seller: seller?.toJSON(),
        category: category?.toJSON(),
        methodPayment
      };
    })
  );

  return {
    totalPages: Math.ceil(productsLength / limit),
    currentPage: Number(page),
    hasNextPage: limit * page < productsLength,
    hasPreviousPage: page > 1,
    products: allProducts
  };
};
