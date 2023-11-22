import Router from 'express';
import validate from '../middlewares/validate';
import authMiddleware from '../middlewares/auth';
import { authValidation, userValidation } from '../validation/index';
import { authController } from '../controllers/index';

export const authRouter = Router();

authRouter.post(
	'/signup',
	validate(authValidation.register),
	authController.signup,
);

authRouter.post(
	'/login',
	validate(authValidation.login),
	authController.signin,
);

authRouter.get(
	'/verify',
	validate(authValidation.verifyEmail),
	authController.verifyEmailController,
)
