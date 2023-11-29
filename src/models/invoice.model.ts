import mongoose, { Document, Schema } from 'mongoose';
import { invoiceStatusTypes } from '../config/invoiceStatusType';

export interface IInvoice extends Document {
	clientId: mongoose.Types.ObjectId;
	invoiceId: string;
	products: Array<{
	  productName: string;
	  amount: number;
	  quantity: number;
	}>;
	dueDate: Date;
	isPaid: boolean;
	status: string;
	createdAt: Date;
	paymentAttempts: number;
	subtotal: number;
	vat: number;
	grandTotal: number;
  }
  

export interface CreateInvoiceBody {
	products: Array<{
		productName: string;
		amount: number;
		quantity: number;
	}>;
	clientId: mongoose.Types.ObjectId;
	noOfInvoice: number;
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
	  products: [
		{
			productName: {
				type: String,
				required: true,
		  	},
			amount: {
				type: Number,
				required: true,
			},
			quantity: {
				type: Number,
				required: true,
			},
		},
	  ],
	  dueDate: {
		type: Date,
		default: Date.now(),
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
	  subtotal: {
		type: Number,
		required: true,
	  },
	  vat: {
		type: Number,
		required: true,
	  },
	  grandTotal: {
		type: Number,
		required: true,
	  },
	},
	{ timestamps: true, collection: 'invoice' },
  );
  
  export const Invoice = mongoose.model<IInvoice>('Invoice', invoiceSchema);
  