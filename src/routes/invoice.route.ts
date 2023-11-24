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

