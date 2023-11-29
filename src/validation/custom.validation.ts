import mongoose from 'mongoose';
import { CustomHelpers } from 'joi';
import { PhoneNumberUtil } from 'google-libphonenumber';

const phoneUtil = PhoneNumberUtil.getInstance();

/**
 * @description Validate if the provided value is a valid Nigerian phone number.
 * @param {string} value The phone number to be validated.
 * @returns {Promise<boolean>} Promise resolved with the validation result.
 */
export const checkNumber = async (
	contact: string,
	helpers: CustomHelpers,
): Promise<any> => {
	const number = phoneUtil.parseAndKeepRawInput(contact, 'NG');
	if (!phoneUtil.isValidNumberForRegion(number, 'NG')) {
		return helpers.error(`Invalid number`).message;
	}

	return contact;
};

/**
 * @description Validate if the provided value is a valid MongoDB ObjectId.
 * @param value - The string to be validated as ObjectId.
 * @param helpers - The Joi helpers for error messages.
 * @returns The validated ObjectId if valid.
 */
export const objectId = (value: string): string => {
	if (!mongoose.isValidObjectId(value)) {
		return 'Invalid ObjectId';
	}
	return value;
};

/**
 * @description Validate if the provided password meets the criteria.
 * @param value - The password string to be validated.
 * @param helpers - The Joi helpers for error messages.
 * @returns The validated password if it meets the criteria.
 */
export const passwordHelper = (
	value: string,
	helpers: CustomHelpers,
): string => {
	if (value.length < 8) {
		return helpers.error('string.min', { limit: 8 }).message;
	}
	if (!/\d/.test(value) || !/[a-zA-Z]/.test(value)) {
		return helpers.error('password.invalidFormat').message;
	}
	return value;
};
