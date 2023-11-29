import httpStatus from 'http-status';
import moment from 'moment';
import Asyncly from '../utils/Asyncly';
import { emailService, invoiceService, userService } from '../services/index';
import ApiError from '../utils/ApiError';
import { Invoice } from '../services/email.service';
import { logger } from '../config/logger';

const createInvoice = Asyncly(async (req, res) => {
	console.log(req.body.products);
	if (!req.body || !req.body.clientId || !req.body.products) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid request body');
	}

	const client = await userService.getClientById(req.body.clientId);
	const clientEmail = client?.clientEmail as string;

	if (!clientEmail) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid client email');
	}

	const invoice = await invoiceService.createInvoice({
		...req.body,
	});

	if (!invoice) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Invoice not created');
	}

	const emailData = {
		invoiceId: invoice.invoiceId,
		invoiceDate: moment(invoice.createdAt).format('DD-MM-YYYY'),
		date: moment(invoice.dueDate).format('DD-MM-YYYY'),
		clientName: client?.clientName as string,
		products: invoice.products.map((product) => ({
			productName: product.productName,
			amount: product.amount,
			quantity: product.quantity,
		})),
		subtotal: invoice.subtotal,
		vat: invoice.vat,
		grandTotal: invoice.grandTotal,
		address: 'Client Address Placeholder',
	};
	console.log(emailData);
	const isSent = await emailService.sendInvoice(
		clientEmail,
		emailData as unknown as Invoice,
	);
	if (isSent) {
		logger.info('Email sent successdully');
	} else {
		logger.error('Email not sent');
	}

	res.status(httpStatus.CREATED).json({
		status: httpStatus.CREATED,
		success: true,
		message: 'Invoice created successfully',
	});
});

const getInvoiceById = Asyncly(async (req, res) => {
	const invoiceId = req.params?.invoiceId as string;

	const invoice = await invoiceService.getInvoiceById(invoiceId);

	if (!invoice) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Invoice not found');
	}

	res.status(httpStatus.OK).json({
		status: httpStatus.OK,
		success: true,
		message: 'Invoice retrieved successfully',
		data: invoice,
	});
});

const updateInvoice = Asyncly(async (req, res) => {
	const invoiceId = req.params?.id as string;
	const invoice = await invoiceService.updateInvoiceById(invoiceId, req.body);

	if (!invoice) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Invoice not found');
	}

	res.status(httpStatus.OK).json({
		status: httpStatus.OK,
		success: true,
		message: 'Invoice updated successfully',
		data: invoice,
	});
});

const getAllInvoices = Asyncly(async (req, res) => {
	const invoices = await invoiceService.getAll();
	if (!invoices) {
		throw new ApiError(httpStatus.NOT_FOUND, 'No invoices found for client');
	}

	res.status(httpStatus.OK).json({
		status: httpStatus.OK,
		success: true,
		message: 'Invoices retrieved successfully',
		data: invoices,
	});
});

const getInvoiceCount = Asyncly(async (req, res) => {
	const invoiceCount = await invoiceService.getInvoiceCount();

	if (!invoiceCount) {
		throw new ApiError(httpStatus.NOT_FOUND, 'No invoice count found');
	}

	res.status(httpStatus.OK).json({
		status: httpStatus.OK,
		success: true,
		message: 'Invoice count retrieved successfully',
		data: invoiceCount,
	});
});

const markInvoicePaid = Asyncly(async (req, res) => {
	const invoiceId = req.params?.id as string;
	const invoice = await invoiceService.markInvoicePaid(invoiceId);

	if (!invoice) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Invoice not found');
	}
	res.status(httpStatus.OK).json({
		status: httpStatus.OK,
		success: true,
		message: 'Invoice marked paid',
		data: invoice,
	});
});

const deleteInvoiceById = Asyncly(async (req, res) => {
	const invoiceId = req.params.invoiceId as string;
	const invoice = await invoiceService.deleteInvoiceById(invoiceId);
	if (!invoice) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Invoice not found');
	}
	res.status(httpStatus.NO_CONTENT).json({
		status: httpStatus.NO_CONTENT,
		success: true,
		message: 'Invoice deleted successfully',
	});
});

const getPaidInvoicesController = Asyncly(async (req, res) => {
	const invoices = await invoiceService.getPaidInvoices();

	if (!invoices) {
		throw new ApiError(httpStatus.NOT_FOUND, 'No invoices found for client');
	}

	res.status(httpStatus.OK).json({
		status: httpStatus.OK,
		success: true,
		message: 'Invoices retrieved successfully',
		data: invoices,
	});
});

const getUnpaidInvoicesController = Asyncly(async (req, res) => {
	const invoices = await invoiceService.getUnpaidInvoices();

	if (!invoices) {
		throw new ApiError(httpStatus.NOT_FOUND, 'No invoices found for client');
	}

	res.status(httpStatus.OK).json({
		status: httpStatus.OK,
		success: true,
		message: 'Invoices retrieved successfully',
		data: invoices,
	});
});

const getOverdueInvoicesController = Asyncly(async (req, res) => {
	const invoices = await invoiceService.getOverdueInvoices();

	if (!invoices) {
		throw new ApiError(httpStatus.NOT_FOUND, 'No invoices found for client');
	}

	res.status(httpStatus.OK).json({
		status: httpStatus.OK,
		success: true,
		message: 'Invoices retrieved successfully',
		data: invoices,
	});
});

const getClientInvoicesController = Asyncly(async (req, res) => {
	const clientId = req.params?.clientId as string;
	const invoices = await invoiceService.getClientInvoices(clientId);

	if (!invoices) {
		throw new ApiError(httpStatus.NOT_FOUND, 'No invoices found for client');
	}

	res.status(httpStatus.OK).json({
		status: httpStatus.OK,
		success: true,
		message: 'Invoices retrieved successfully',
		data: invoices,
	});
});

const getClientPaidInvoicesController = Asyncly(async (req, res) => {
	const clientId = req.params?.clientId as string;
	const invoices = await invoiceService.getClientPaidInvoices(clientId);

	if (!invoices) {
		throw new ApiError(httpStatus.NOT_FOUND, 'No invoices found for client');
	}

	res.status(httpStatus.OK).json({
		status: httpStatus.OK,
		success: true,
		message: 'Invoices retrieved successfully',
		data: invoices,
	});
});

const getClientUnpaidInvoicesController = Asyncly(async (req, res) => {
	const clientId = req.params?.clientId as string;
	const invoices = await invoiceService.getClientUnpaidInvoices(clientId);

	if (!invoices) {
		throw new ApiError(httpStatus.NOT_FOUND, 'No invoices found for client');
	}

	res.status(httpStatus.OK).json({
		status: httpStatus.OK,
		success: true,
		message: 'Invoices retrieved successfully',
		data: invoices,
	});
});

const getDueInvoicesController = Asyncly(async (req, res) => {
	const invoices = await invoiceService.getDueInvoices();

	if (!invoices) {
		throw new ApiError(httpStatus.NOT_FOUND, 'No invoices found for client');
	}

	res.status(httpStatus.OK).json({
		status: httpStatus.OK,
		success: true,
		message: 'Invoices retrieved successfully',
		data: invoices,
	});
});

export const invoiceController = {
	createInvoice,
	getInvoiceById,
	updateInvoice,
	getAllInvoices,
	getInvoiceCount,
	markInvoicePaid,
	deleteInvoiceById,
	getPaidInvoicesController,
	getUnpaidInvoicesController,
	getOverdueInvoicesController,
	getClientInvoicesController,
	getClientPaidInvoicesController,
	getClientUnpaidInvoicesController,
	getDueInvoicesController,
};
