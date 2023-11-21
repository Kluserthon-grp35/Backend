import httpStatus from 'http-status';
import Asyncly from '../utils/Asyncly';
import { authService } from '../services/index';
import ApiError from '../utils/ApiError';

const signin = Asyncly(async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		throw new ApiError(
			httpStatus.BAD_REQUEST,
			'Email and password are required',
		);
	}
	const user = await authService.login(email, password);
	if (!user) {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
	}
	res.status(httpStatus.OK).json({
		status: httpStatus.OK,
		success: true,
		message: 'User logged in successfully',
		data: user,
	});
});

const signup = Asyncly(async (req, res) => {
	if (!req.body) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Body cannot be empty');
	}
	const user = await authService.register(req.body);
	if (!user) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'User not created');
	}
	res.status(httpStatus.CREATED).json({
		status: httpStatus.CREATED,
		success: true,
		message: 'User created successfully',
	});
});

export const authController = {
	signin,
	signup,
};
