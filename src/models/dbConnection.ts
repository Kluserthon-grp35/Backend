import mongoose from 'mongoose';
import { logger } from '../config/logger';

/**
 * @description Connect to MongoDB.
 * @param {string} configUrl The MongoDB connection string.
 * @returns {Promise<void>} A promise that resolves when the connection is successful.
 * @example connectToMongoose('connection string'});
 */
export const connectToMongoose = async (configUrl: string): Promise<void> => {
	try {
		mongoose.set('strictQuery', false);
		await mongoose.connect(configUrl);
		logger.info('Connected to MongoDB');
	} catch (error) {
		logger.error('Error connecting to Mongoose:', error);
		process.exit(1);
	}
};
