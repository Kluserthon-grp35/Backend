import morgan from 'morgan';
import { logger } from './logger';
import config from '.';

morgan.token('message', (req, res) => {
	// @ts-ignore
	return res.locals.errorMessage || '';
});

/**
 * @description Get IP address of the client. This method caters for the fact that the IP address may be forwarded by a proxy.
 * @returns {string} The IP address of the client.
 */
const getIpFormat = () =>
	config.env === 'production' ? ':remote-addr - ' : '';

const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

const successHandler = morgan(successResponseFormat, {
	skip: (req, res) => res.statusCode >= 400,
	stream: { write: (message) => logger.info(message.trim()) },
});

const errorHandler = morgan(errorResponseFormat, {
	skip: (req, res) => res.statusCode < 400,
	stream: { write: (message) => logger.error(message.trim()) },
});

export default {
	successHandler,
	errorHandler,
};
