import nodemailer, { TransportOptions } from 'nodemailer';
import { logger } from '../config/logger';
import config from '../config/index';

const transport = nodemailer.createTransport(
	config.email.smtp as TransportOptions,
);
if (config.env !== 'test') {
	transport
		.verify()
		.then(() => logger.info('Connected to email server'))
		.catch(() =>
			logger.warn(
				'Unable to connect to email server. Make sure you have configured the SMTP options in .env',
			),
		);
}

/**
 * @description Send an email to the specified email address
 * @param {string} to - The email address of the recipient
 * @param {string} subject - The subject of the email
 * @param {string} text - The body of the email
 * @returns {Promise<void>} Promise resolved when the email is sent
 */
const sendMail = async (
	to: string,
	subject: string,
	text: string,
): Promise<void> => {
	const msg = { from: config.email.from, to, subject, html: text };
	await transport.sendMail(msg);
};

/**
 * @description Send a password reset email to the specified email address
 * @param {string} to - The email address of the recipient
 * @param {string} token - The password reset token
 * @returns {Promise<boolean>} Promise resolved when the email is sent
 */
const sendResetPasswordEmail = async (
	to: string,
	token: string,
): Promise<boolean> => {
	const subject = 'Reset Password';
	// Ensure the change the baseurl to that of the frontend here
	const resetPasswordUrl = `${config.baseUrl}/api/v1/auth/reset-password?token=${token}`;
	const text = `Dear Customer. To reset your password, please click on this link:\n${resetPasswordUrl}`;
	await sendMail(to, subject, text);
	return true;
};

/**
 * @description Send an email to verify the user's email address
 * @param {string} to - The email address of the recipient
 * @param {string} token - The email verification token
 * @returns {Promise<boolean>} Promise resolved when the email is sent
 */
const sendVerificationEmail = async (
	to: string,
	token: string,
): Promise<boolean> => {
	const subject = 'Verify Email';
	// Ensure the change the baseurl to that of the frontend here
	const verifyEmailUrl = `https://payzen.onrender.com/api/v1/auth/verify?token=${token}`;
	const text = `Dear Customer. To verify your email, please click on this link\n${verifyEmailUrl}\nIf you did not create an account, please ignore this link.`;
	await sendMail(to, subject, text);
	return true;
};

export const emailService = {
	sendMail,
	sendResetPasswordEmail,
	sendVerificationEmail,
};
