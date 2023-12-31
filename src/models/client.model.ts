import mongoose, { Document, Schema, Types } from 'mongoose';
import { logger } from '../config/logger';
import { string } from 'joi';

export interface IClient extends Document {
	businessOwnerId: string;
	clientName: string;
	clientEmail: string;
	clientPhoneNumber: string;
	clientAddress: string;
	createdAt: Date;
}

export interface CreateClientBody {
	businessOwnerId: string;
	clientName: string;
	clientEmail: string;
	clientPhoneNumber: string;
	clientAddress: string;
}

const clientSchema = new Schema<IClient>({
	businessOwnerId: {
		type: String,
		ref: 'User',
		required: true,
	},
	clientName: {
		type: String,
		required: true,
	},
	clientEmail: {
		type: String,
		required: true,
		validate: {
			validator: (v: string) => {
				return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
			},
			message: (props: { value: string }) =>
				`${props.value} is not a valid email!`,
		},
	},
	clientPhoneNumber: {
		type: String,
		required: true,
		validate: {
			validator: (v: string) => {
				return v.length === 11 || v.length === 14;
			},
			message: (props: { value: string }) =>
				`Phone number "${props.value}" must be either 11 or 14 characters long!`,
		},
	},
	clientAddress: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

export const Client = mongoose.model<IClient>('Client', clientSchema);
