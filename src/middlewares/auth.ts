import { RequestHandler, Request, Response, NextFunction } from 'express';
import jwt, { TokenExpiredError, JwtPayload } from 'jsonwebtoken';
import httpStatus from 'http-status';
import config from '../config/index';
import { User, IUser } from '../models/index';
import ApiError from '../utils/ApiError';

declare global {
	namespace Express {
		interface Request {
			user?: IUser;
		}
	}
}

const extractToken = (req: Request): string | null => {
	const bearerToken = req.header('Authorization');
	return bearerToken && bearerToken.startsWith('Bearer ')
		? bearerToken.slice(7, bearerToken.length)
		: null;
};

/**
 * @description Middleware to authenticate user with token
 * @param {string} req - Request object
 * @param {string} res - Response object
 * @param {string} next - Next function
 * @returns {object} - Returns user object
 */
const authMiddleware: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const token = extractToken(req);

	if (!token) {
		return next(new ApiError(httpStatus.UNAUTHORIZED, 'Authentication failed'));
	}

	try {
		const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload & {
			sub: string;
		};
		const user: IUser | null = await User.findById(decoded.sub);

		if (!user) {
			return next(new ApiError(httpStatus.UNAUTHORIZED, 'User not found'));
		}

		req.user = user;
		next();
	} catch (error) {
		if (error instanceof TokenExpiredError) {
			return next(new ApiError(httpStatus.UNAUTHORIZED, 'Token has expired'));
		}
		return next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token'));
	}
};

export default authMiddleware;
