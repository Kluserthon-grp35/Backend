import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { logger } from '../config/logger';

export interface IUser extends Document {
	businessName: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	phoneNumber: string;
	businessDescription: string;
	instagram: string;
	country: string;
	state: string;
	city: string;
	zipCode: string;
	address: string;
	isVerified: boolean;
	refreshToken?: string;
	validatePassword(userPassword: string): Promise<boolean>;
}

export interface CreateUserBody {
	businessName: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	phoneNumber: string;
	businessDescription: string;
	country?: string;
	state?: string;
	city?: string;
	zipCode?: string;
	address?: string;
	instagram?: string;
	isVerified?: boolean;
}

const userSchema = new Schema<IUser>(
	{
		businessName: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		firstName: { 
			type: String, 
			required: true, 
			trim: true 
		},
		lastName: { 
			type: String, 
			required: true, 
			trim: true 
		},
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			trim: true,
		},
		phoneNumber: {
			type: String,
			required: true,
			trim: true,
		},
		businessDescription: {
			type: String,
			trim: true,
			required: true,
		},
		instagram: {
			type: String,
			trim: true,
		},
		country: {
			type: String,
			trim: true,
		},
		state: {
			type: String,
			trim: true,
		},
		city: {
			type: String,
			trim: true,
		},
		zipCode: {
			type: String,
			trim: true,
		},
		address: {
			type: String,
			trim: true,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		refreshToken: {
			type: String,
		},
	},
	{ timestamps: true, collection: 'user' },
);

userSchema.pre<IUser>('save', async function (next) {
	const user = this;
	if (!user.isModified('password')) return next();
	try {
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(user.password, salt);
		user.password = hash;
		next();
	} catch (error: unknown) {
		logger.error(error);
	}
});

userSchema.methods.validatePassword = async function (
	userPassword: string,
): Promise<boolean> {
	return await bcrypt.compare(userPassword, this.password);
};

userSchema.set('toObject', {
	transform: function (doc, ret) {
		delete ret.password;
		delete ret.refreshToken;
		delete ret.__v;
		return ret;
	},
});

export const User = mongoose.model<IUser>('User', userSchema);
