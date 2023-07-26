import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import cookieParser from 'cookie-parser';
import limitter from 'express-rate-limit';
import helmet from 'helmet';

import { swaggerDefinition, connection, config } from '@config';
import { indexRoutes } from '@routes';
import { loggerHTTP } from '@middleware';

dotenv.config();

const specs = swaggerJsdoc(swaggerDefinition);

export const app: express.Application = express();

void connection();

app.set('port', config.app.port);

const whiteList = [config.app.originUrl];

app.use(helmet());
app.use(
  cors({
    origin: function (origin, cb) {
      if (origin === undefined) {
        return cb(null, true);
      }
      if (whiteList.includes(origin)) {
        return cb(null, origin);
      }
      return cb(new Error('Not allowed by CORS'));
    }
  })
);

app.use(
  limitter({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
      status: 429,
      message: 'Too many requests from this IP, please try again in an hour!'
    }
  })
);
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(loggerHTTP);

app.use(`/api/v1`, indexRoutes);
app.use('/docs/v1/', swaggerUi.serve, swaggerUi.setup(specs));
