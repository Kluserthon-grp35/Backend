import httpStatus from 'http-status';
import Asyncly from '../utils/Asyncly';
import { userService } from '../services/index';
import ApiError from '../utils/ApiError';
import { Client } from '../models/index';

const createClientUser = Asyncly(async (req, res) => {
	if (!req.user) {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication failed');
	}
	if (!req.body) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Body cannot be empty');
	}
	const clientBody = {
		businessOwnerId: req.user,
		...req.body,
	};
	const client = await userService.createClient(clientBody);
	if (!client) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Client not created');
	}
	res.status(httpStatus.CREATED).json({
		status: httpStatus.CREATED,
		success: true,
		message: 'Client created successfully',
	});
});

const getClientUsingId = Asyncly(async (req, res) => {
	if (!req.user) {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication failed');
	}
	const id = req.params?.id as string;
	const user = await userService.getClientById(id);
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
	}
	res.status(httpStatus.OK).json({
		status: httpStatus.OK,
		success: true,
		message: 'user retrieved successfully',
		data: user,
	});
});

const getAllClient = Asyncly(async (req, res) => {
	if (!req.user) {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication failed');
	}
	const client = await Client.find();
	if (!client) {
		throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
	}
	res.status(httpStatus.OK).json({
		status: httpStatus.OK,
		success: true,
		message: 'users retrieved successfully',
		data: client,
	});
});

const updateClient = Asyncly(async (req, res) => {
	if (!req.user) {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication failed');
	}
	const id = req.params?.id as string;
	const client = await userService.updateClientById(id, req.body);
	if (!client) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Client not found');
	}
	res.status(httpStatus.OK).json({
		status: httpStatus.OK,
		success: true,
		message: 'client updated successfully',
		data: client,
	});
});

const deleteClient = Asyncly(async (req, res) => {
	if (!req.user) {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication failed');
	}
	const id = req.params?.id as string;
	const client = await userService.deleteClientById(id);
	if (!client) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Client not found');
	}
	res.status(httpStatus.NO_CONTENT).json({
		status: httpStatus.NO_CONTENT,
		success: true,
		message: 'client deleted successfully',
	});
});

const queriedClient = Asyncly(async (req, res) => {
	if (!req.user) {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication failed');
	}
	const { limit, page, where, include, exclude } = req.query;
	const includeArray = Array.isArray(include)
		? include.filter((item) => typeof item === 'string')
		: [];
	const client = await userService.queryClient(
		Number(limit),
		Number(page),
		where,
		includeArray as string[],
		exclude as string[],
	);
	if (!client) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Client not found');
	}
	res.status(httpStatus.OK).json({
		status: httpStatus.OK,
		success: true,
		message: 'users retrieved successfully',
		data: client,
	});
});

export const userController = {
	createClientUser,
	getClientUsingId,
	getAllClient,
	updateClient,
	deleteClient,
	queriedClient,
};
