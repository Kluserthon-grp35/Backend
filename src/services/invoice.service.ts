import httpStatus from 'http-status';
import { Invoice, CreateInvoiceBody, IInvoice, User } from '../models/index';
import ApiError from '../utils/ApiError';
import { logger } from '../config/logger';
import mongoose, { Mongoose } from 'mongoose';
import { NumberSchema } from 'joi';
import { invoiceStatusTypes } from '../config/invoiceStatusType';

const generateInvoiceId = async (clientId: mongoose.Types.ObjectId) => {
	//TODO: create this function that will find the number of invoices for a client and then return a string in the format PK000*
};

const createInvoice = async (
	invoiceBody: CreateInvoiceBody,
): Promise<IInvoice> => {
	const invoiceId = await generateInvoiceId(invoiceBody.clientId);

	const invoice = Object.assign(invoiceBody, { invoiceId: invoiceId });

	const createdInvoice = await Invoice.create(invoice);

	if (!createdInvoice) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Invoice not created');
	}

	return createdInvoice;
};

const getInvoiceById = async (invoiceId: string): Promise<IInvoice> => {
	const invoice = await Invoice.findById(invoiceId);

	if (!invoice) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Invoice not found');
	}

	return invoice;
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

// const getAllInvoices = async (): Promise<any> => {
// 	let limit = 1;
// 	let page = 1;

// 	const invoicesCount = await Invoice.estimatedDocumentCount();
// 	const invoices = await Invoice.find({})
// 		.skip((page - 1) * limit)
// 		.limit(limit);

// 	const count = invoices.length;
// 	const totalPages = Math.round(invoicesCount / count) || 0;
// 	const hasNextPage = page < totalPages;
// 	const hasPreviousPage = page > 1;
// 	const nextPage = hasNextPage ? page + 1 : null;
// 	const previousPage = hasPreviousPage ? page - 1 : null;
// 	return {
// 		invoices,
// 		page,
// 		limit,
// 		count,
// 		totalPages,
// 		hasNextPage,
// 		hasPreviousPage,
// 		nextPage,
// 		previousPage,
// 	};
// };

const getInvoiceCount = async (): Promise<number> => {
	const invoicesCount = await Invoice.estimatedDocumentCount();
	return invoicesCount;
};

const deleteInvoiceById = async (
	invoiceId: string,
): Promise<IInvoice | null> => {
	const invoice = await Invoice.findByIdAndDelete(invoiceId);

	if (!invoice) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Invoice not found');
	}

	logger.info('Invoice deleted successfully');
	return invoice;
};

const markInvoiceOverdue = async (invoiceId: string): Promise<IInvoice> => {
	const invoice = await getInvoiceById(invoiceId);

	if (!invoice) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Invoice not found');
	}

	Object.assign(invoice, { status: invoiceStatusTypes.OVERDUE });
	await invoice.save();

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

export const invoiceService = {
	generateInvoiceId,
	createInvoice,
	getInvoiceById,
	updateInvoiceById,
	// getAllInvoices,
	getInvoiceCount,
	deleteInvoiceById,
	markInvoiceOverdue,
	markInvoicePaid,
};
