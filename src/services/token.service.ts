import jwt, {  JwtPayload } from 'jsonwebtoken';
import moment from 'moment';
import httpStatus from 'http-status';
import config from '../config/index';
import { User, IUser, Token } from '../models/index';
import { userService } from './index';
import ApiError from '../utils/ApiError';
import { tokenTypes } from '../config/tokenType';
import { logger } from '../config/logger';

interface Payload {
	sub: string | { id: string; email: string };
	iat: number;
	exp: number;
	type: string;
}

/**
 * @description Generate token from payload object
 * @param payload Payload object to generate token from
 * @param expires Expiration date of token
 * @param type Type of token to generate
 * @param secret Secret to use for token generation
 * @param blacklisted Whether token is blacklisted or not
 * @returns Generated token object
 */
const generateToken = (
	userId: string,
	expires: moment.Moment,
	type: string,
	secret: string = config.jwt.secret,
): string => {
	const payload: Payload = {
		sub: userId,
		iat: moment().unix(),
		exp: expires.unix(),
		type,
	};
	return jwt.sign(payload, secret);
};

/**
 * @description Save token to database
 * @param userId string ID of user to save token for
 * @param expires Expiration date of token
 * @param type string type of token to save
 * @param blacklisted Whether token is blacklisted or not
 * @returns Generated token object
 */
const saveToken = async (
	token: string,
	userId: string,
	expires: moment.Moment,
	type: string,
	blacklisted: boolean = false,
): Promise<IUser> => {
	const user = await User.findOne({ _id: userId });
	if (!user) {
		throw new Error('User not found');
	}
	user.refreshToken = token;
	await user.save();

	return user;
};

/**
 * @description Verify token
 * @param token string token to verify
 * @param type string type of token to verify
 * @returns Generated token object
 */
const verifyToken = async (token: string): Promise<any> => {
	try {
		console.log('Verifying token: ', token);
		const payload = jwt.verify(token, config.jwt.secret) as JwtPayload & { sub: string};
		if (!payload) {
			console.log("Failed to verify token in the verifytoken service");
		}
		// console.log(JSON.parse(payload));
		const tokenDoc = await Token.findOne({
			token, 
			type: tokenTypes.VERIFY_EMAIL, 
			user: payload.sub,
			blacklisted: false,
		});
		if (!tokenDoc) {
			throw new Error('Token not found');
		}
		return tokenDoc;
	} catch (error) {
		const errorMessage = (error as Error).message;
		logger.error(`Error verifying token: ${errorMessage}`);
		throw error;
	}
  };
/**
 * @description Generate auth tokens from user object
 * @param user User object to generate tokens from
 * @returns {Promise<object>} Generated auth tokens from user object
 */
const generateAuthTokens = async (user: any) => {
	const accessTokenExpires = moment().add(
		config.jwt.accessExpirationMinutes,
		'm',
	);
	const accessToken = generateToken(
		user.id,
		accessTokenExpires,
		tokenTypes.ACCESS,
	);

	const refreshTokenExpires = moment().add(
		config.jwt.refreshExpirationDays,
		'days',
	);
	const refreshToken = generateToken(
		user.id,
		refreshTokenExpires,
		tokenTypes.REFRESH,
	);

	return {
		access: {
			token: accessToken,
			expires: accessTokenExpires.toDate(),
		},
		refresh: {
			token: refreshToken,
			expires: refreshTokenExpires.toDate(),
		},
	};
};

/**
 * @description Generate reset password token from email
 * @param {string} email Email to generate reset password token from
 * @returns {Promise<string>} Generated reset password token from email
 */
const generateResetPasswordToken = async (email: string) => {
	const user = await userService.getUserByEmail(email);
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
	}
	const expires = moment().add(
		config.jwt.resetPasswordExpirationMinutes,
		'minutes',
	);
	const resetPasswordToken = generateToken(
		user.id,
		expires,
		tokenTypes.RESET_PASSWORD,
	);
	await saveToken(
		resetPasswordToken,
		user.id,
		expires,
		tokenTypes.RESET_PASSWORD,
	);
	return resetPasswordToken;
};

/**
 * @description Generate verify email token from user object
 * @param {object} user User object to generate verify email token from
 * @returns {Promise<string>} Generated verify email token from user object
 */
const generateVerifyEmailToken = async (user: any) => {
	const expires = moment().add(
		config.jwt.verifyEmailExpirationMinutes,
		'minutes',
	);
	const verifyEmailToken = generateToken(
		user._id,
		expires,
		tokenTypes.VERIFY_EMAIL,
	);
	const userId = user._id;
	await Token.create({
		token: verifyEmailToken,
		user: userId,
		type: tokenTypes.VERIFY_EMAIL,
		expires: expires,
	});
	return verifyEmailToken;
};

export const tokenService = {
	generateToken,
	saveToken,
	verifyToken,
	generateAuthTokens,
	generateResetPasswordToken,
	generateVerifyEmailToken,
};
