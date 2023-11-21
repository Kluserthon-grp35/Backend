// import swaggerJsdoc from 'swagger-jsdoc'
// import swaggerUi from 'swagger-ui-express'
const swaggerAutogen = require('swagger-autogen')();
// import { Express } from 'express'
// const options = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Klusterthon API',
//       description: "API endpoints for Klusterthon API",
//       version: '1.0.0',
//     },
//     servers: [
//       {
//         url: "http://localhost:3001/",
//         description: "Local server"
//       }
//     ]
//   },
//   // looks for configuration in specified directories
//   // apis: ['./controllers/*.js'],
// }

const doc = {
	info: {
		title: 'Klusterthon API',
		description: 'API endpoints for Klusterthon API',
		version: '1.0.0',
	},
};

const outputFile = './swagger-output.json';
const routes = ['../app.ts'];
// const swaggerSpec = swaggerJsdoc(options)
swaggerAutogen(outputFile, routes, doc);
