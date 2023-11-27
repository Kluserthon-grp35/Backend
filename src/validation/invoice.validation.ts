import Joi from 'joi';
import { objectId } from './custom.validation';

/**
 * @description Validation schema for creating an invoice.
 */
const createInvoice = {
	body: Joi.object().keys({
		amount: Joi.number().required(),
		dueDate: Joi.date(),
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
