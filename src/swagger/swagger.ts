import swaggerAutogen from 'swagger-autogen';

const doc = {
	info: {
		title: 'Klusterthon API',
		description: 'API endpoints for Group 35 Klusterthon API',
		version: '1.0.0',
	},
};

const outputFile = '../swagger-output.json';
const routes = ['../routes/auth.route.ts', '../routes/user.route.ts'];

swaggerAutogen(outputFile, routes, doc);

export default doc;

// Import necessary modules and configurations
// import swaggerAutogen from 'swagger-autogen';
// import type RoutesInput  from 'swagger-autogen';

// const doc = {
// 	info: {
// 	  title: 'Klusterthon API',
// 	  description: 'API endpoints for Group 35 Klusterthon API',
// 	  version: '1.0.0',
// 	},
// };

// const outputFile = './swagger-output.json';
// const routes: typeof RoutesInput = ['../routes/auth.route.ts', '../routes/user.route.ts'] as any;

// swaggerAutogen(outputFile, routes, doc);

// export default doc;
