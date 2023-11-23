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

const queryInvoices = Asyncly(async (req, res) => {
	const { clientName, status, isPaid, dueDate } = req.query;
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
	// const invoices = await invoiceService.getAllInvoices()

	// if (!invoices) {
	//     throw new ApiError(httpStatus.NOT_FOUND, 'No invoices found for client')
	// }

	const invoices = await Invoice.find();
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

const markInvoiceOverdue = Asyncly(async (req, res) => {
	const invoiceId = req.params?.id as string;
	const invoice = await invoiceService.markInvoiceOverdue(invoiceId);

	if (!invoice) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Invoice not found');
	}
	res.status(httpStatus.OK).json({
		status: httpStatus.OK,
		success: true,
		message: 'Invoice marked overdue',
		data: invoice,
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
	const invoiceId = req.params?.invoiceId as string;
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
