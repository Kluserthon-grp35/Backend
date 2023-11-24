import express from 'express';
import { authRouter } from './auth.route';
import { clientRouter } from './user.route';
import { invoiceRouter } from './invoice.route';

const router = express.Router();

const defaultRoutes: {
	path: string;
	route: any;
}[] = [
	{
		path: '/auth',
		route: authRouter,
	},
	{
		path: '/user',
		route: clientRouter,
	},
	{
		path: '/invoice',
		route: invoiceRouter,
	},
];

defaultRoutes.forEach((route) => {
	router.use(route.path, route.route);
});

export default router;
