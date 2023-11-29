import mongoose, { Document, Schema } from 'mongoose';

export enum TransactionStatus {
    'pending' = 'pending',
    'failed' = 'failed',
    'success' = 'success',
}

export interface ITransaction extends Document {
    invoiceId: string;
    clientId: string;
    amount: number;
    status: TransactionStatus;
    currency: string;
    provider_ref: string;
    in_app_ref: string;
}

const transactionSchema = new Schema<ITransaction>({
    invoiceId: {
        type: String,
        required: true,
    },
    clientId: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(TransactionStatus),
        default: TransactionStatus.pending,
    },
    currency: {
        type: String,
    },
    provider_ref: {
        type: String,

    },
    in_app_ref: {
        type: String,
    },
}, {
    timestamps: true,
});

export const TXN = mongoose.model<ITransaction>('Transaction', transactionSchema);