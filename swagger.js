// const swaggerJsDoc = require('swagger-jsdoc');
// const swaggerUi = require('swagger-ui-express');

// const swaggerOptions = {
//   swaggerDefinition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'NFT Minting API',
//       version: '1.0.0',
//       description: 'API for storing and retrieving NFT data'
//     },
//     servers: [
//       {
//         url: 'http://localhost:3000', 
//         description: 'Local server'
//       },
//       {
//         url: 'https://nft-minting-jo3q.onrender.com',
//         description: 'Deployed server'
//       }
//     ]
//   },
//   apis: ['./app.js']
// };

// const swaggerDocs = swaggerJsDoc(swaggerOptions);

// const swaggerSetup = (app) => {
//   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// };

// module.exports = swaggerSetup;
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc'); 

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'NFT Minting API',
      version: '1.0.0',
      description: 'API for storing and retrieving NFT data'
    },
    servers: [
      {
        url: 'http://localhost:3000', 
        description: 'Local server'
    
      },
      {
        url: 'https://nft-minting-jo3q.onrender.com',
        description: 'Deployed server'

      }
    ]
  },
  apis: ['./app.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const swaggerSetup = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

module.exports = swaggerSetup;