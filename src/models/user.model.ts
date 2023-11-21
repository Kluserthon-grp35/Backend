import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
    businessName: string;
    username: string;
    email: string;
    password: string;
    description: string;
    instagram: string;
    isVerified: boolean;
    validatePassword(userPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
    businessName: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    email: { 
        type: String, 
        required: true, 
        trim: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true, 
        trim: true 
    },
    description: { 
        type: String,      
        trim: true 
    },
    instagram: { 
        type: String, 
        trim: true 
    },
    isVerified: {
        type: Boolean,
        default: false,
    }},
    { timestamps: true, collection: 'user'},
);


userSchema.pre<IUser>('save', async function(next) {
    const user = this;
    if (!user.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
})

userSchema.methods.validatePassword = async function (userPassword: string): Promise<boolean> {
    return await bcrypt.compare(userPassword, this.password);
}

export const User = mongoose.model<IUser>('User', userSchema);