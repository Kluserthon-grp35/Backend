import Router from 'express';
import authMiddleware from '../middlewares/auth';
import validate from '../middlewares/validate';
import { invoiceValidation } from '../validation/index';
import { invoiceController } from '../controllers/index';

export const invoiceRouter = Router();

invoiceRouter.post(
	'/create',
	validate(invoiceValidation.createInvoice),
	authMiddleware,
	invoiceController.createInvoice,
);

invoiceRouter.get(
	'/get/:invoiceId',
	validate(invoiceValidation.validateIdParams),
	authMiddleware,
	invoiceController.getInvoiceById,
);

invoiceRouter.get(
	'/get/client/paid/:clientId',
	validate(invoiceValidation.validateIdParams),
	authMiddleware,
	invoiceController.getClientPaidInvoicesController
);

invoiceRouter.get(
	'/get/client/unpaid/:clientId',
	validate(invoiceValidation.validateIdParams),
	authMiddleware,
	invoiceController.getClientUnpaidInvoicesController
);

invoiceRouter.get(
	'/get/overdue/',
	authMiddleware,
	invoiceController.getOverdueInvoicesController,
);

invoiceRouter.get(
	'/get/due',
	authMiddleware,
	invoiceController.getDueInvoicesController
);

invoiceRouter.patch(
	'/update/:invoiceId',
	validate(invoiceValidation.validateIdParams),
	authMiddleware,
	invoiceController.updateInvoice,
);

invoiceRouter.delete(
	'/delete/:invoiceId',
	validate(invoiceValidation.validateIdParams),
	authMiddleware,
	invoiceController.deleteInvoiceById,
);

invoiceRouter.get(
	'/all',
	authMiddleware,
	invoiceController.getAllInvoices,
);

invoiceRouter.get(
	'/get/count',
	authMiddleware,
	invoiceController.getInvoiceCount,
);