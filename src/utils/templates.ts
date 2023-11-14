export const getActivationTemplate = (refreshToken: string): string => {
  return `<a href='${refreshToken}'>Confirmar cuenta</a>`;
};
