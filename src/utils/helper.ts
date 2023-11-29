import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber';

const phoneUtil = PhoneNumberUtil.getInstance();
const PNF = PhoneNumberFormat;

/**
 * @description Convert the provided phone number to the E164 format.
 * @param {string} contact The phone number to be converted.
 * @returns {Promise<string>} Promise resolved with the converted phone number.
 */
export const convertNumberToNigerianFormat = async (
	contact: string,
): Promise<string> => {
	const number = phoneUtil.parseAndKeepRawInput(contact, 'NG');

	const contactRes = phoneUtil.format(number, PNF.E164);
	return contactRes;
};
