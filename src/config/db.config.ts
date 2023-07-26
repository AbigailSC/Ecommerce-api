import chalk from 'chalk';
import mongoose from 'mongoose';

import { config, logger } from '@config';
// import { RolSchema } from '@models';
// import rolSchema from '../data/rol.json';

mongoose.set('strictQuery', false);

const db =
  config.app.env === 'production'
    ? config.db.uri
    : 'mongodb://127.0.0.1:27017/ecommerce';

export const connection = async (): Promise<void> => {
  try {
    await mongoose.connect(db);
    logger.info('✔️ ...Database connected!');
    // await RolSchema.insertMany(rolSchema);
  } catch (error) {
    logger.error(error);
    throw new Error(chalk.red('❌ ...Database connection failed!'));
  }
};
