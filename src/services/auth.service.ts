import httpStatus from 'http-status';
import moment from 'moment';
import { IUser, CreateUserBody, Token } from '../models/index';
import { userService, tokenService, emailService } from './index';
import ApiError from '../utils/ApiError';
import config from '../config/index';
import { tokenTypes } from '../config/tokenType';
import { convertNumberToNigerianFormat } from '../utils/helper';

/**
 * @description Login with email and password
 * @param {string} email - The user email
 * @param {string} password - The user password
 * @returns {Promise<{ user: IUser; tokens: any }>} Returns a promise that resolves when the user is logged in
 */
const login = async (
	email: string,
	password: string,
): Promise<{ user: IUser; tokens: any }> => {
	const user: IUser | null = await userService.getUserByEmail(email);

	if (!user) {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email');
	}

	if (!(await user.validatePassword(password))) {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect password');
	}

	if (user.isVerified === false) {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Email not verified');
	}

	const tokens = await tokenService.generateAuthTokens(user);
	user.refreshToken = tokens.refresh.token;
	await user.save();

	// Exclude refreshToken from the tokens object
	const tokensWithoutRefreshToken = {
		...tokens,
		refresh: undefined,
	};

	return {
		...user.toObject(),
		tokens: tokensWithoutRefreshToken,
	};
};

const register = async (userBody: CreateUserBody): Promise<boolean> => {
	const user = await userService.createUser(userBody);
	const token = await tokenService.generateVerifyEmailToken(user);
	await emailService.sendVerificationEmail(user.email, token);
	return true;
};

/**
 * @description Verify email using the provided token
 * @param {string} token - The email verification token
 * @returns {Promise<IUser>} - Returns the verified user
 */
const verifyEmail = async (token: string): Promise<boolean> => {
	const tokenDoc = await tokenService.verifyToken(
		token,
		tokenTypes.VERIFY_EMAIL,
	);
	if (!tokenDoc) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid token');
	}

	const now = moment();
	if (now.isAfter(tokenDoc.expires)) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Token expired');
	}

	const user = await userService.getUserById(tokenDoc.user);
	if (!user) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
	}
	user.isVerified = true;
	await user.save();

	tokenDoc.blacklisted = true;
	await tokenDoc.save();

	return true;
};

/**
 * @description generate a password reset token and send it to the user's email
 * @param {string} email - The email address of the user
 */
const forgotPassword = async (email: string): Promise<boolean> => {
	const resetPasswordToken =
		await tokenService.generateResetPasswordToken(email);
	if (!resetPasswordToken) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
	}

	const isEmailSent = await emailService.sendResetPasswordEmail(
		email,
		resetPasswordToken,
	);
	if (!isEmailSent) {
		throw new ApiError(
			httpStatus.BAD_REQUEST,
			'An error occurred in sending email',
		);
	}

	return true;
};

const resetPassword = async (
	token: string,
	newPassword: string,
): Promise<boolean> => {
	console.log('token from service: ', token);
	const tokenDoc = await tokenService.verifyToken(
		token,
		tokenTypes.RESET_PASSWORD,
	);
	if (!tokenDoc) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid token');
	}

	const now = moment();
	if (now.isAfter(tokenDoc.expires)) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Token expired');
	}

	const user = await userService.getUserById(tokenDoc.user);
	if (!user) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
	}

	user.password = newPassword;
	await user.save();

	tokenDoc.blacklisted = true;
	await tokenDoc.save();

	// Generate a new refresh token
	const expires = moment().add(config.jwt.refreshExpirationDays, 'days');
	const refreshToken = tokenService.generateToken(user._id, expires, 'REFRESH');
	await tokenService.saveToken(refreshToken, user._id, expires, 'REFRESH');

	return true;
};

export const authService = {
	login,
	register,
	verifyEmail,
	forgotPassword,
	resetPassword,
};
