export const getMessageByRole = (role: string, email: string): string => {
  return `${role} Signup is success. An Email with Verification link has been sent to your account ${email}. Please Verify Your Email first or use the email verification link which is been send with the response body to verify your email.`;
};
