export const taxes = (price: number): number => {
  const priceTotal = price * 1.05;
  return Math.ceil(priceTotal);
};
