import Joi from 'joi';
import { passwordHelper } from './custom.validation';

/**
 * @description Validation schema for user registration.
 */
const register = {
	body: Joi.object().keys({
		businessName: Joi.string().required(),
		email: Joi.string().required().email(),
		username: Joi.string().required(),
		password: Joi.string().required().custom(passwordHelper),
		instagramHandle: Joi.string(),
		description: Joi.string(),
	}),
};

/**
 * @description Validation schema for user login.
 */
const login = {
	body: Joi.object().keys({
		email: Joi.string().required(),
		password_hash: Joi.string().required(),
	}),
};

/**
 * @description Validation schema for user logout.
 */
const logout = {
	body: Joi.object().keys({
		refreshToken: Joi.string().required(),
	}),
};

/**
 * @description Validation schema for token refresh.
 */
const refreshTokens = {
	body: Joi.object().keys({
		refreshToken: Joi.string().required(),
	}),
};

/**
 * @description Validation schema for forgot password.
 */
const forgotPassword = {
	body: Joi.object().keys({
		email: Joi.string().email().required(),
	}),
};

/**
 * @description Validation schema for reset password.
 */
const resetPassword = {
	query: Joi.object().keys({
		token: Joi.string().required(),
	}),
	body: Joi.object().keys({
		password: Joi.string().required().custom(passwordHelper),
	}),
};

/**
 * @description Validation schema for email verification.
 */
const verifyEmail = {
	query: Joi.object().keys({
		token: Joi.string().required(),
	}),
};

export const authValidation = {
	register,
	login,
	logout,
	refreshTokens,
	forgotPassword,
	resetPassword,
	verifyEmail,
};
