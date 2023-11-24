import mongoose, { Document, Schema } from 'mongoose';
import { invoiceStatusTypes } from '../config/invoiceStatusType';

export interface IInvoice extends Document {
	invoiceId: string;
	clientId: mongoose.Types.ObjectId;
	amount: Number;
	dueDate: Date;
	isPaid: boolean;
	status: string;
	createdAt: Date;
	paymentAttempts: Number;
}

export interface CreateInvoiceBody {
	amount: Number;
}

const invoiceSchema = new Schema<IInvoice>(
	{
		clientId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Client',
			required: true,
		},
		invoiceId: {
			type: String,
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		dueDate: {
			type: Date,
			deafult: Date.now(),
		},
		isPaid: {
			type: Boolean,
			default: false,
		},
		status: {
			type: String,
			enum: [
				invoiceStatusTypes.OVERDUE,
				invoiceStatusTypes.PAID,
				invoiceStatusTypes.PENDING,
			],
			default: invoiceStatusTypes.PENDING,
		},
		createdAt: {
			type: Date,
			default: Date.now(),
		},
		paymentAttempts: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true, collection: 'invoice' },
);

export const Invoice = mongoose.model<IInvoice>('Invoice', invoiceSchema);
