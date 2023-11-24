import Joi from 'joi';

/**
 * @description Validation schema for creating an invoice.
 */
const createInvoice = {
    body: Joi.object().keys({
        amount: Joi.number().required(),
        dueDate: Joi.date(),
    }),
};

export const invoiceValidation = {
    createInvoice,
};