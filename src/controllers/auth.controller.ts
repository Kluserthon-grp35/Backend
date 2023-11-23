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
		message: 'User created, Check your mail for verification link',
	});
});

const verifyEmailController = Asyncly(async (req, res) => {
	const token = req.query.token as string;

	if (!token) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Token is required');
	}
	const user = await authService.verifyEmail(token);
	if (!user) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
	}
	res.status(httpStatus.OK).json({
		status: httpStatus.OK,
		success: true,
		message: 'Email verified successfully',
		data: user.toObject(),
	});
});

const forgotPasswordController = Asyncly(async (req, res) => {
	const { email } = req.body;
	if (!email) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Email is required');
	}

	await authService.forgotPassword(email);
	res.status(httpStatus.OK).json({
		status: httpStatus.OK,
		success: true,
		message: 'Password reset link sent successfully',
	});
});

const resetPasswordController = Asyncly(async (req, res) => {
	const token = req.query?.token as string;
	console.log('token from controller: ', token);
	const { newPassword, confirmPassword } = req.body;
	if (newPassword !== confirmPassword) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Passwords do not match');
	}

	await authService.resetPassword(token, newPassword);
	res.status(httpStatus.OK).json({
		status: httpStatus.OK,
		success: true,
		message: 'Password reset successful',
	});
});

export const authController = {
	signin,
	signup,
	verifyEmailController,
	forgotPasswordController,
	resetPasswordController,
};
