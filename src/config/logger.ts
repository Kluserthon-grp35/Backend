import winston from 'winston';
import config from './index';

/**
 * @description Custom format for logging errors.
 * @param {Error} info The error to log.
 * @returns {Error} The error to log.
 */
const enumerateErrorFormat = winston.format((info) => {
	if (info instanceof Error) {
		Object.assign(info, { message: info.stack });
	}
	return info;
});

/**
 * @description Logger object with the following methods:
 * @description logger.error() - For logging errors.
 * @description logger.warn() - For logging warnings.
 * @description logger.info() - For logging information.
 * @description logger.http() - For logging http requests.
 * @description logger.debug() - For logging debug messages.
 * @description logger.silly() - For logging silly messages.
 * @returns {Logger} The logger object.
 * @example logger.error('Error message');
 */
export const logger = winston.createLogger({
	level: config.env === 'development' ? 'debug' : 'info',
	format: winston.format.combine(
		enumerateErrorFormat(),
		config.env === 'development'
			? winston.format.colorize()
			: winston.format.uncolorize(),
		winston.format.splat(),
		winston.format.printf(({ level, message }) => `${level}: ${message}`),
	),
	transports: [
		new winston.transports.Console({
			stderrLevels: ['error'],
		}),
	],
});
