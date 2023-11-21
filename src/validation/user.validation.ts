import Joi from 'joi';
import { objectId, passwordHelper } from './custom.validation';

/**
 * @description Validation schema for client profile creation.
 */
const createClient = {
	clientEmail: Joi.string().required().email(),
	clientName: Joi.string().required(),
	clientPhoneNumber: Joi.string().required(),
	clientAddress: Joi.string().required(),
};

/**
 * @description Validation schema for getting a user.
 */
const getClient = {
	params: Joi.object().keys({
		clientId: Joi.string().custom(objectId),
	}),
};

/**
 * @description Validation schema for updating a user.
 */
const updateUser = {
	params: Joi.object().keys({
		userId: Joi.required().custom(objectId),
	}),
	body: Joi.object()
		.keys({
			businessName: Joi.string().email(),
			email: Joi.string(),
			username: Joi.string(),
			instagramHandle: Joi.string(),
			description: Joi.string(),
		})
		.min(1),
};

/**
 * @description Validation schema for updating a client.
 */
const updateClient = {
	params: Joi.object().keys({
		clientId: Joi.required().custom(objectId),
	}),
	body: Joi.object()
		.keys({
			clientEmail: Joi.string().email(),
			clientName: Joi.string(),
			clientPhoneNumber: Joi.string(),
			clientAddress: Joi.string(),
		})
		.min(1),
};

/**
 * @description Validation schema for deleting a client.
 */
const deleteClient = {
	params: Joi.object().keys({
		clientId: Joi.string().custom(objectId),
	}),
};

export const userValidation = {
	createClient,
	getClient,
	updateUser,
	updateClient,
	deleteClient,
};
