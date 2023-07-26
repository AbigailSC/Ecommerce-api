import path from 'path';
import { createLogger, format, transports } from 'winston';

import { getCurrentDate, getColorByLvl } from '@utils';
import { config } from '@config';

const consoleTransport = new transports.Console({
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf(({ level, message, timestamp }) => {
      const styledLvl = getColorByLvl(level);
      return `${styledLvl} ${timestamp as string} ${message as string}`;
    })
  )
});

const fileTransport = new transports.File({
  filename: path.join(__dirname, `/../logs/app_${getCurrentDate()}.log`),
  level: config.app.env === 'development' ? 'info' : 'debug',
  maxsize: 5242880, // 5MB
  maxFiles: 5
});

export const logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf(({ level, message, timestamp }) => {
      return `[${level.toUpperCase()}] ${timestamp as string} ${
        message as string
      }`;
    })
  ),
  transports: [consoleTransport, fileTransport]
});
