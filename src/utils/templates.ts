export const getActivationTemplate = (refreshToken: string): string => {
  return `<a>${refreshToken}</a>`;
};
