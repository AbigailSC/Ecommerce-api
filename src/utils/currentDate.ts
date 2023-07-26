export const getCurrentDate = (): string => {
  return new Date().toISOString().slice(0, 10);
};
