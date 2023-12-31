import Joi from 'joi';
import express from 'express';
import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import { logger } from '../config/logger';

type SchemaObject = {
	params?: Joi.ObjectSchema;
	query?: Joi.ObjectSchema;
	body?: Joi.ObjectSchema;
};

export default function validate(schema: SchemaObject) {
	return (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction,
	) => {
		const validSchema = pick(schema, ['params', 'query', 'body']);
		const object = pick(req, Object.keys(validSchema));
		const { value, error } = Joi.compile(validSchema)
			.prefs({ errors: { label: 'key' }, abortEarly: false })
			.validate(object);

		if (error) {
			const body = {} as Record<string, any>;
			const query = {} as Record<string, any>;
			const errorMessage = {} as Record<string, any>;
			error.details.map((details) => {
				switch (details.path[0]) {
					case 'body':
						body[details.path[1]] = details.message.replace(/"/g, "'");
						break;
					case 'query':
						query[details.path[1]] = details.message.replace(/"/g, "'");
						break;
					default:
						break;
				}
				logger.error(details);
			});

			Object.keys(body).length !== 0 && (errorMessage.body = body);
			Object.keys(query).length !== 0 && (errorMessage.query = query);

			return next(
				new ApiError(
					httpStatus.BAD_REQUEST,
					JSON.stringify(errorMessage),
					undefined,
					undefined,
					true,
				),
			);
		}
		Object.assign(req, value);
		return next();
	};
}
