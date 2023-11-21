import mongoose, { Document, Schema } from 'mongoose';
import { tokenTypes }  from '../config/tokenType';

export interface IToken extends Document {
  token: string;
  user: mongoose.Types.ObjectId;
  type: string;
  expires: Date;
  blacklisted: boolean;
}

const tokenSchema =  new Schema<IToken>({
  token: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: [
      tokenTypes.REFRESH,
      tokenTypes.RESET_PASSWORD,
      tokenTypes.VERIFY_EMAIL,
      tokenTypes.ACCESS,
    ],
    required: true,
  },
  expires: {
    type: Date,
    required: true,
  },
  blacklisted: {
    type: Boolean,
    default: false,
  },
});

export const Token = mongoose.model<IToken>('Token', tokenSchema);