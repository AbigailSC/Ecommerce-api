import path from 'path';
import { config } from '@config';

export const swaggerDefinition = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Ecommerce API',
      version: '1.0.0',
      description: 'Ecommerce API, REST API with Swagger doc',
      contact: {
        email: 'abigailsarzuri@gmail.com'
      }
    },
    tags: [
      {
        name: 'Auth',
        description: 'Authentication routes'
      },
      {
        name: 'User',
        description: 'User routes'
      },
      {
        name: 'Product',
        description: 'Product routes'
      },
      {
        name: 'Cart',
        description: 'Cart routes'
      },
      {
        name: 'Order',
        description: 'Order routes'
      },
      {
        name: 'Category',
        description: 'Category routes'
      },
      {
        name: 'Review',
        description: 'Review routes'
      },
      {
        name: 'Payment',
        description: 'Payment routes'
      },
      {
        name: 'Shipping',
        description: 'Shipping routes'
      },
      {
        name: 'Order',
        description: 'Order routes'
      },
      {
        name: 'Role',
        description: 'Role routes'
      },
      {
        name: 'Tag',
        description: 'Tag routes'
      },
      {
        name: 'Favorite',
        description: 'Favorite routes'
      }
    ],
    schemes: ['http', 'https'],
    securityDefinitions: {
      Bearer: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        description:
          'JWT Authorization header using the Bearer scheme. Example: "Bearer {token}"'
      }
    },
    servers: [
      {
        url: `http://127.0.0.1:${config.app.port}`
      }
    ]
  },
  apis: [path.join(__dirname, '../docs/*.yaml')]
};
