import { app } from './app';
import { logger } from '@config';

const main = app.listen(app.get('port'), () => {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  logger.info(`🚀...Server running on http://127.0.0.1:${app.get('port')}`);
});

process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(`${err.name}: ${err.message}`);
  logger.error('uncaughtException Err:', err);
  logger.error('uncaughtException Stack:', err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (uncaughtExc: Error) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(`${uncaughtExc.name}: ${uncaughtExc.message}`);
  logger.error('uncaughtException Err:', uncaughtExc);
  logger.error('uncaughtException Stack:', JSON.stringify(uncaughtExc.stack));
  process.exit(1);
});

process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
  main.close(() => {
    logger.info('💤 Process terminated!');
    process.exit(0);
  });
});
