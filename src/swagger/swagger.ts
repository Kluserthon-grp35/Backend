
import swaggerDocument from './swagger-output.json';
import swaggerAutogen from 'swagger-autogen'
import SwaggerUi from 'swagger-ui-express'


const doc = {
	info: {
		title: 'Klusterthon API',
		description: 'API endpoints for Klusterthon API',
		version: '1.0.0',
	},
};

const outputFile = './swagger-output.json';
const routes = ['../routes/auth.route.ts', '../routes/user.route.ts'];


swaggerAutogen(outputFile, routes, doc)

export default swaggerDocument

