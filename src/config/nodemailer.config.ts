import { createTransport } from 'nodemailer';
import dotenv from 'dotenv';

import { config, logger } from '@config';

dotenv.config();

const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: config.email.user,
    pass: config.email.pass
  }
});

export const sendEmail = async (
  email: string,
  subject: string,
  html: string
): Promise<void> => {
  try {
    await transporter.sendMail({
      from: `E-commerce <${config.email.user}>`,
      to: email,
      subject,
      html
    });
  } catch (error) {
    logger.error({ message: (error as Error).message });
  }
};
