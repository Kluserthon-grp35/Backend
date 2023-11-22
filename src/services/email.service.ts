import nodemailer, { TransportOptions } from 'nodemailer';
import { logger } from '../config/logger'; 
import config from '../config/index';

const transport = nodemailer.createTransport(config.email.smtp as TransportOptions);
if (config.env !== 'test') {
    transport
        .verify()
        .then(() => logger.info('Connected to email server'))
        .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));  
};

/**
 * @description Send an email to the specified email address
 * @param {string} to - The email address of the recipient
 * @param {string} subject - The subject of the email
 * @param {string} text - The body of the email
 * @returns {Promise<void>} Promise resolved when the email is sent
 */
const sendMail = async (to: string, subject: string, text: string) => {
    const msg = { from: config.email.from, to, subject, html: text };
    await transport.sendMail(msg);
}

const sendResetPasswordEmail = async (to: string, token: string) => {
    const subject = 'Reset Password';
    const resetPasswordUrl = `${process.env.FRONTEND_BASE}/reset-password?token=${token}`;
    const text = `Dear Customer. To reset your password, please click on this link: ${resetPasswordUrl}`;
    await sendMail(to, subject, text);
    return true;
}