/**
 * @description Custom error class for API errors.
 * @class Error Error class for API errors. Used internally to throw errors in the API.
 * @param {number} statusCode - The HTTP status code of the error.
 * @param {string} message - The error message.
 * @param {boolean} isOperational - Whether the error is operational.
 * @param {string} stack - The error stack.
 * @param {boolean} validation - Whether the error is a validation error.
 * @returns {Error} An error object.
 * @example throw new ApiError(404, 'User not found');
 */
class ApiError extends Error {
	statusCode: number;
	isOperational: boolean;
	constructor(
		statusCode: number,
		message: string,
		isOperational = true,
		stack = '',
		validation = false,
	) {
		super(message);
		validation && (this.message = JSON.parse(message));
		this.statusCode = statusCode;
		this.isOperational = isOperational;
		if (stack) {
			this.stack = stack;
		} else {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

export default ApiError;
