import httpStatus from 'http-status';
import Asyncly from '../utils/Asyncly';
import { invoiceService } from '../services/index';
import ApiError from '../utils/ApiError';
import { Invoice } from '../models/index';

const createInvoice = Asyncly(async (req, res) => {
	if (!req.body) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Body cannot be empty');
	}

	const invoice = await invoiceService.createInvoice(req.body);

	if (!invoice) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Invoice not created');
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
})

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
})

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
