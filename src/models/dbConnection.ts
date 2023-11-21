import mongoose from 'mongoose';
import { logger } from '../config/logger';

export const connectToMongoose = async (configUrl: string) => {
    try {
     
        mongoose.set('strictQuery', false)
        await mongoose.connect(configUrl)
        logger.info("Connected to MongoDB");
          
    } catch (error) {
        logger.error("Error connecting to Mongoose:", error);
        process.exit(1);
    }
};