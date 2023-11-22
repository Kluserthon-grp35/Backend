import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { logger } from '../config/logger';
import { invoiceStatusTypes } from '../config/invoiceStatusType';

export interface IInvoice extends Document {
    clientId:  mongoose.Types.ObjectId;
	amount: Number;
	dueDate: Date;
    isPaid: boolean;
    status: string;
    createdAt: Date;
    paymentAttempts: Number;
}

export interface CreateInvoiceBody {
    clientId:  mongoose.Types.ObjectId;
	amount: Number;
	dueDate: Date;
    isPaid: boolean;
    status: string;
    createdAt: Date;
    paymentAttempts: Number;
}

const invoiceSchema = new Schema<IInvoice>({
		clientId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Client',
			required: true,
		},
		amount: {
			type: Number,
            required: true
		},
        dueDate: {
            type: Date
        },
        isPaid: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            enum: [
                invoiceStatusTypes.OVERDUE,
                invoiceStatusTypes.PAID,
                invoiceStatusTypes.PENDING
            ]
        },
        createdAt: {
            type: Date,
            default: Date.now()
        },
        paymentAttempts: {
            type: Number,
            default: 0
        }
	},
	{ timestamps: true, collection: 'user' },
);