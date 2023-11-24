import httpStatus from 'http-status';
import { User, CreateUserBody, IUser } from '../models/index';
import { Client, CreateClientBody, IClient } from '../models/index';
import ApiError from '../utils/ApiError';
import { logger } from '../config/logger';

/**
 * @description Check if the user email is already taken
 * @param {string} email - The user email to check
 * @returns {Promise<boolean>} Returns a promise that resolves when the user email is taken or not
 */
const isEmailTaken = async (email: string): Promise<boolean> => {
	const user = await User.findOne({ email });
	return !!user;
};

/**
 * @description Create a user
 * @param {object} userBody - The user body to create
 * @returns {Promise<IUser>} Returns a promise that resolves when the user is created
 */
const createUser = async (userBody: CreateUserBody): Promise<IUser> => {
	if (await isEmailTaken(userBody.email)) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
	}

	const user = await User.create(userBody);

	if (!user) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'User not created');
	}

	return user;
};

/**
 * @description Get a user by id
 * @param userId - The user id to get the user from
 * @returns {Promise<IUser>} Returns a promise that resolves when the user is found
 */
const getUserById = async (userId: string): Promise<IUser> => {
	const user = await User.findById(userId);
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
	}
	return user;
};

/**
 * @description Get a user by email
 * @param {string} email - The user email to get the user  from
 * @returns {Promise<object>} Returns a promise that resolves when the user is found
 */
const getUserByEmail = async (email: string): Promise<IUser> => {
	const user = await User.findOne({ email });

	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
	}

	return user;
};

const createClient = async (body: CreateClientBody): Promise<IClient> => {
	const clientName = `${body.firstName} ${body.lastName}`;

	const clientBody = {
		clientName,
		businessOwnerId: body.businessOwnerId,
		clientEmail: body.clientEmail,
		clientPhoneNumber: body.clientPhoneNumber,
		clientAddress: body.clientAddress,
	};

	const client = await Client.create({ ...clientBody });

	if (!client) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Client not created');
	}

	return client;
};

/**
 * @description Get a client by id
 * @param clientId - The client id to get the user from
 * @returns {Promise<IClient>} Returns a promise that resolves when the client is found
 */
const getClientById = async (clientId: string): Promise<IClient> => {
	const client = await Client.findById(clientId);
	if (!client) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Client not found');
	}
	return client;
};

/**
 * @description Get a client by email
 * @param {string} clientEmail - The client email to get the client  from
 * @returns {Promise<object>} Returns a promise that resolves when the client is found
 */
const getClientByEmail = async (clientEmail: string): Promise<IClient> => {
	const client = await Client.findOne({ clientEmail });

	if (!client) {
		throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
	}

	return client;
};

/**
 * @description Update a user by id
 * @param {string} clientId - The user id to update
 * @param {object} updateBody - The user body to update
 * @param {string[]} exclude - The user fields to exclude
 * @returns {Promise<object>} Returns a promise that resolves when the user is updated
 */
const updateClientById = async (
	clientId: string,
	updateBody: CreateClientBody,
): Promise<any> => {
	const client = await getClientById(clientId);
	if (!client) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Client not found');
	}
	Object.assign(client, updateBody);
	await client.save();
	return {
		...client,
		createdAt: undefined,
	};
};

/**
 * @description Delete a client by id
 * @param clientId The id of the client to delete
 * @returns {Promise<IClient | null>} Returns a promise that resolves when the client is deleted
 */
const deleteClientById = async (clientId: string): Promise<IClient | null> => {
	const client = await Client.findByIdAndDelete(clientId);

	if (!client) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Client not found');
	}

	logger.info('Client deleted successfully');
	return client;
};

/**
 * @description Query users by their attributes
 * @param {number} limit - The number of users to return
 * @param {number} page - The page of users to return
 * @param {string[]} where - The user attributes to query
 * @param {string[]} include - The user attributes to include
 * @param {string[]} exclude - The user attributes to exclude
 * @returns {Promise<object>} Returns a promise that resolves when the users are queried
 */
const queryClient = async (
	limit: number,
	page: number,
	where: any,
	include: string[] = [],
	exclude: string[] = [],
): Promise<any> => {
	page = page || 1;
	limit = limit || 20;

	const clientsCount = await Client.estimatedDocumentCount(where);
	const clients = await User.find(where)
		.skip((page - 1) * limit)
		.limit(limit)
		.select([include.join(' '), exclude.join(' ')].join(' '));

	const count = clients.length;
	const totalPages = Math.round(clientsCount / count) || 0;
	const hasNextPage = page < totalPages;
	const hasPreviousPage = page > 1;
	const nextPage = hasNextPage ? page + 1 : null;
	const previousPage = hasPreviousPage ? page - 1 : null;
	return {
		clients,
		page,
		limit,
		count,
		totalPages,
		hasNextPage,
		hasPreviousPage,
		nextPage,
		previousPage,
	};
};

export const userService = {
	isEmailTaken,
	createUser,
	getUserById,
	getUserByEmail,
	createClient,
	getClientById,
	getClientByEmail,
	updateClientById,
	deleteClientById,
	queryClient,
};
