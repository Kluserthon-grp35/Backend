import Joi from 'joi';
import { objectId } from './custom.validation';

/**
 * @description Validation schema for creating an invoice.
 */
const createInvoice = {
	body: Joi.object().keys({
		products: Joi.array().items(
			Joi.object().keys({
				productName: Joi.string().required(),
				amount: Joi.number().required(),
				quantity: Joi.number().required(),
			}),
		),
		clientId: Joi.string().required(),
	}),
};

/**
 * @description Validation schema for id.
 */
const validateIdParams = {
	params: Joi.object().keys({
		invoiceId: Joi.string().custom(objectId),
	}),
};

export const invoiceValidation = {
	createInvoice,
	validateIdParams,
};
