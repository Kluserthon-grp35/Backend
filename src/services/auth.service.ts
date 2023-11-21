import httpStatus from 'http-status';
import { User, IUser, CreateUserBody } from '../models/index';
import { userService, tokenService } from './index';
import ApiError from '../utils/ApiError';

/**
 * @description Login with email and password
 * @param {string} email - The user email
 * @param {string} password - The user password
 * @returns {Promise<{ user: IUser; tokens: any }>} Returns a promise that resolves when the user is logged in
 */
const login = async (
    email: string,
    password: string
  ): Promise<{ user: IUser; tokens: any }> => {
    const user: IUser | null = await userService.getUserByEmail(email);
  
    if (!user || !(await user.validatePassword(password))) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        'Incorrect email or password'
      );
    }

    const tokens = await tokenService.generateAuthTokens(user);
    user.refreshToken = tokens.refresh.token;
    await user.save();
  
    return {
        ...user.toObject(),
        tokens,
    };
};

const signup = async (userBody: CreateUserBody): Promise<{ user: IUser }> => {
    const user = await userService.createUser(userBody);
    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'User not created');
    }
    return {
        ...user.toObject(),
    };
}

export const authService = {
    login,
    signup,
};