export const messageEmailNotFound = (email: string): string => {
  return `The email address ${email} is not associated with any account. Double-check your email address and try again.`;
};

export const messageForgotPassword = (email: string): string => {
  return `Auth success. An Email with Reset password link has been sent to your account ${email}. Please check to rest your password or use the the link which is been send with the response body to rest your password`;
};

export const messageResetPassword = (): string => {
  return `Your password has been successfully updated please login`;
};

export const messageTokenExpired = (): string => {
  return 'Email verification token is invalid or has expired. Please click on resend for verify your Email.';
};

export const messageEmailVerified = (): string => {
  return 'Email verified! Now you can login with your new password.';
};

export const messageEmailAlreadyVerified = (): string => {
  return 'Your email has already been verified. Please Login.';
};

export const messageEmailAlreadyActivated = (): string => {
  return 'Your email has already been activated. Please Login.';
};

export const messageEmailActivated = (): string => {
  return 'Account activated! Now you can login with your new password.';
};

export const messageEmailDesactivated = (): string => {
  return 'Account desactivated!';
};
// ! Cambiar a objeto con todos los msgs
