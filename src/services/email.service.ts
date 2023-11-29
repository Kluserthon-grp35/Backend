import nodemailer, { TransportOptions } from 'nodemailer';
import { logger } from '../config/logger';
import config from '../config/index';
import { generateEmailTemplate } from '../utils/email-template/sendVerification';
import { generateInvoiceEmailTemplate } from '../utils/email-template/sendInvoiceEmail';

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

interface InvoiceItem {
	clientId: string;
	productName: string;
	amount: number;
	quantity: number;
}

export interface Invoice {
	invoiceId: string;
	invoiceDate: string;
	clientName: string;
	address: string;
	date: string;
	greeting: string;
	products: InvoiceItem[];
	subtotal: number;
	vat: number;
	grandTotal: number;
	paymentLink: string;
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
	// Generate the email template with the provided token
	const emailBody = generateEmailTemplate(token);

	// Assuming you have a function to send emails, update this part accordingly
	const subject = 'Verify Email';
	await sendMail(to, subject, emailBody); // Update this line with your email sending logic

	return true;
};

/**
 * @description Send an invoice to the specified email address
 * @param {string} to - The email address of the recipient
 * @param {string} subject - The subject of the email
 * @param {InvoiceData} invoiceData - The invoice data
 * @returns {Promise<boolean>} Promise resolved when the email is sent
 */
export const sendInvoice = async (
	to: string,
	invoiceData: Invoice,
): Promise<boolean> => {
	const subject = 'Invoice from Payzen';
	const emailBody = generateInvoiceEmailTemplate(invoiceData);
	// Use your email service to send the email
	await sendMail(to, subject, emailBody);

	return true;
};

export const emailService = {
	sendMail,
	sendResetPasswordEmail,
	sendVerificationEmail,
	sendInvoice,
};
