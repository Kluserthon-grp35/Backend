import Joi from 'joi';
import { passwordHelper, checkNumber } from './custom.validation';

/**
 * @description Validation schema for user registration.
 */
const register = {
	body: Joi.object().keys({
		businessName: Joi.string().required(),
		firstName: Joi.string().required(),
		lastName: Joi.string().required(),
		email: Joi.string().required().email(),
		password: Joi.string().required().custom(passwordHelper),
		phoneNumber: Joi.string().required(),
		businessDescription: Joi.string().required(),
		instagramHandle: Joi.string(),
		country: Joi.string(),
		state: Joi.string(),
		city: Joi.string(),
		zipCode: Joi.string(),
		address: Joi.string(),
	}),
};

/**
 * @description Validation schema for user login.
 */
const login = {
	body: Joi.object().keys({
		email: Joi.string().required(),
		password: Joi.string().required(),
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
		newPassword: Joi.string().required().custom(passwordHelper),
		confirmPassword: Joi.string().required().custom(passwordHelper),
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
	refreshTokens,
	forgotPassword,
	resetPassword,
	verifyEmail,
};
