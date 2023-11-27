import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { Client, IClient } from '../models/index';
import ApiError from '../utils/ApiError';
import { logger } from '../config/logger';
import { invoiceStatusTypes } from '../config/invoiceStatusType';
import { Invoice, CreateInvoiceBody, IInvoice } from '../models/index';

const createInvoice = async (body: CreateInvoiceBody): Promise<IInvoice> => {
	const client: IClient | null = await Client.findOne().sort({ createdAt: -1 });

	if (!client) {
		throw new ApiError(
			httpStatus.NOT_FOUND,
			'Recently created client not found',
		);
	}

	const clientId = client._id;

	if (!mongoose.isValidObjectId(clientId)) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid client ID');
	}

	const noOfInvoice = client.noOfInvoice + 1;

	// Generate the invoice id in the specified format
	const formattedNoOfInvoice = String(noOfInvoice).padStart(3, '0');
	const invoiceId = `PZ-0${formattedNoOfInvoice}`;

	const invoiceBody = {
		...body,
		clientId,
		invoiceId,
	};

	const createdInvoice = await Invoice.create(invoiceBody);

	if (!createdInvoice) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Invoice not created');
	}

	// Update the noOfInvoice field of the client
	await Client.findByIdAndUpdate(
		invoiceBody.clientId,
		{ noOfInvoice: noOfInvoice },
		{ new: true },
	);

	return createdInvoice;
};

const getInvoiceById = async (invoiceId: string): Promise<IInvoice> => {
	const invoice = await Invoice.findById(invoiceId);

	if (!invoice) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Invoice not found');
	}

	return invoice;
};

// Get all paid invoices
const getPaidInvoices = async (): Promise<IInvoice[]> => {
	const invoices = await Invoice.find({ status: invoiceStatusTypes.PAID });

	if (!invoices) {
		throw new ApiError(httpStatus.NOT_FOUND, 'No paid invoices found');
	}

	return invoices;
};

// Get all unpaid invoices
const getUnpaidInvoices = async (): Promise<IInvoice[]> => {
	const invoices = await Invoice.find({ status: invoiceStatusTypes.PENDING });

	if (!invoices) {
		throw new ApiError(httpStatus.NOT_FOUND, 'No unpaid invoices found');
	}

	return invoices;
};

// Get all overdue invoices
const getOverdueInvoices = async (): Promise<IInvoice[]> => {
	const invoices = await Invoice.find({ status: invoiceStatusTypes.OVERDUE });

	if (!invoices) {
		throw new ApiError(httpStatus.NOT_FOUND, 'No overdue invoices found');
	}

	return invoices;
};

// Get all invoices of a client
const getClientInvoices = async (clientId: string): Promise<IInvoice[]> => {
	const invoices = await Invoice.find({ clientId });

	if (!invoices) {
		throw new ApiError(httpStatus.NOT_FOUND, 'No invoices found for client');
	}

	return invoices;
};

// Get all paid invoice by a client
const getClientPaidInvoices = async (clientId: string): Promise<IInvoice[]> => {
	const invoices = await Invoice.find({
		clientId,
		status: invoiceStatusTypes.PAID,
	});

	if (!invoices) {
		throw new ApiError(httpStatus.NOT_FOUND, 'No paid invoices found');
	}

	return invoices;
};

// Get all unpaid invoice by a client
const getClientUnpaidInvoices = async (
	clientId: string,
): Promise<IInvoice[]> => {
	const invoices = await Invoice.find({
		clientId,
		status: invoiceStatusTypes.PENDING,
	});

	if (!invoices) {
		throw new ApiError(httpStatus.NOT_FOUND, 'No unpaid invoices found');
	}

	return invoices;
};

// Get all overdue invoice by a client
const getClientOverdueInvoices = async (
	clientId: string,
): Promise<IInvoice[]> => {
	const invoices = await Invoice.find({
		clientId,
		status: invoiceStatusTypes.OVERDUE,
	});

	if (!invoices) {
		throw new ApiError(httpStatus.NOT_FOUND, 'No overdue invoices found');
	}

	return invoices;
};

const updateInvoiceById = async (
	invoiceId: string,
	update: Partial<CreateInvoiceBody> | CreateInvoiceBody,
): Promise<any> => {
	const invoice = await getInvoiceById(invoiceId);

	if (!invoice) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Invoice not found');
	}
	Object.assign(invoice, update);
	await invoice.save();
	return {
		...invoice,
		createdAt: undefined,
	};
};

// Get all invoice and add paignation to it
const getAll = async (): Promise<IInvoice[]> => {
	const invoices = await Invoice.find();
	if (!invoices) {
		throw new ApiError(httpStatus.NOT_FOUND, 'No invoices found for client');
	}
	return invoices;
};

const getInvoiceCount = async (): Promise<number> => {
	const invoicesCount = await Invoice.estimatedDocumentCount();
	return invoicesCount;
};

const deleteInvoiceById = async (
	invoiceId: string,
): Promise<IInvoice | null> => {
	const invoice = await Invoice.findOne({ invoiceId: invoiceId });

	if (!invoice) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Invoice not found');
	}

	await invoice.deleteOne();

	logger.info('Invoice deleted successfully');
	return invoice;
};

const markInvoicePaid = async (invoiceId: string): Promise<IInvoice> => {
	const invoice = await getInvoiceById(invoiceId);

	if (!invoice) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Invoice not found');
	}

	Object.assign(invoice, { status: invoiceStatusTypes.PAID });
	await invoice.save();

	return invoice;
};

const markOverdueInvoices = async (): Promise<void> => {
	const currentDate = new Date();
	const overdueInvoices = await Invoice.find({
		status: invoiceStatusTypes.PENDING,
		dueDate: { $lt: currentDate },
	});

	if (overdueInvoices && overdueInvoices.length > 0) {
		// Update the status of overdue invoices
		await Invoice.updateMany(
			{ _id: { $in: overdueInvoices.map((invoice) => invoice._id) } },
			{ status: invoiceStatusTypes.OVERDUE },
		);
	}
};

const getDueInvoices = async (): Promise<IInvoice[]> => {
	const currentDate = new Date();
	const dueInvoices = await Invoice.find({
		status: invoiceStatusTypes.PENDING,
		dueDate: { $gte: currentDate },
	});

	if (!dueInvoices) {
		throw new ApiError(httpStatus.NOT_FOUND, 'No due invoices found');
	}

	return dueInvoices;
};

export const invoiceService = {
	createInvoice,
	getAll,
	getInvoiceById,
	getPaidInvoices,
	getUnpaidInvoices,
	getOverdueInvoices,
	getClientPaidInvoices,
	getClientUnpaidInvoices,
	getClientOverdueInvoices,
	updateInvoiceById,
	getInvoiceCount,
	deleteInvoiceById,
	markOverdueInvoices,
	markInvoicePaid,
	getClientInvoices,
	getDueInvoices,
};
