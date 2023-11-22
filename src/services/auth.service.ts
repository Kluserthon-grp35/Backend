import httpStatus from 'http-status';
import moment from 'moment';
import { IUser, CreateUserBody, Token } from '../models/index';
import { userService, tokenService, emailService } from './index';
import ApiError from '../utils/ApiError';

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

	if (!user || !(await user.validatePassword(password))) {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
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
const verifyEmail = async (token: string): Promise<IUser> => {
	const tokenDoc = await tokenService.verifyToken(token);
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

	return user;

}

export const authService = {
	login,
	register,
	verifyEmail,
};
