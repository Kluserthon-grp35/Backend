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

// clientRouter.post(
// 	'/login',
// 	validate(authValidation.login),
// 	authController.signin,
// );

// clientRouter.get(
// 	'/verify',
// 	validate(authValidation.verifyEmail),
// 	authController.verifyEmailController,
// );

// clientRouter.post(
// 	'/forgot-password',
// 	validate(authValidation.forgotPassword),
// 	authController.forgotPasswordController,
// );

// clientRouter.post(
// 	'/reset-password',
// 	validate(authValidation.resetPassword),
// 	authController.resetPasswordController,
// );