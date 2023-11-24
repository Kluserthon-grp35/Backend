import Router from 'express';
import authMiddleware from '../middlewares/auth';
import validate from '../middlewares/validate';
import { userValidation } from '../validation/index';
import { userController } from '../controllers/index';

export const clientRouter = Router();

clientRouter.post(
	'/create',
	validate(userValidation.createClient),
	authMiddleware,
	userController.createClientUser,
);

