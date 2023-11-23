import express from 'express';
import { authRouter } from './auth.route';

const router = express.Router();

const defaultRoutes: {
	path: string;
	route: any;
}[] = [
	{
		path: '/auth',
		route: authRouter,
	},
];

defaultRoutes.forEach((route) => {
	router.use(route.path, route.route);
});

export default router;
