import mongoose from "mongoose";
import { CustomHelpers } from 'joi';

/**
 * @description Validate if the provided value is a valid MongoDB ObjectId.
 * @param value - The string to be validated as ObjectId.
 * @param helpers - The Joi helpers for error messages.
 * @returns The validated ObjectId if valid. 
 */
export const objectId = (value: string, helpers: CustomHelpers): string => {
    if (!mongoose.isValidObjectId(value)) {
        return helpers.error("any.invalid", { message: "Invalid ID" }).message;
    }
    return value;
}

/**
 * @description Validate if the provided password meets the criteria.
 * @param value - The password string to be validated.
 * @param helpers - The Joi helpers for error messages.
 * @returns The validated password if it meets the criteria.
 */
export const passwordHelper = (value: string, helpers: CustomHelpers): string => {
    if (value.length < 8) {
        return helpers.error('string.min', { limit: 8 }).message;
    }
    if (!/\d/.test(value) || !/[a-zA-Z]/.test(value)) {
        return helpers.error('password.invalidFormat').message;
    }
    return value;
};
