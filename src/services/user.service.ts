import httpStatus from "http-status";
import { User, CreateUserBody, IUser } from "../models/user.model";
import ApiError from "../utils/ApiError";
import { logger } from "../config/logger";

/**
 * @description Check if the user email is already taken
 * @param {string} email - The user email to check
 * @returns {Promise<boolean>} Returns a promise that resolves when the user email is taken or not
 */
const isEmailTaken = async (email: string): Promise<boolean> => {
    const user = await User.findOne({ email });
    return !!user;
};

/**
 * @description Create a user
 * @param {object} userBody - The user body to create
 * @returns {Promise<IUser>} Returns a promise that resolves when the user is created
 */
const createUser = async (userBody: CreateUserBody): Promise<IUser> => {
    if (await isEmailTaken(userBody.email)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
  
    const user = await User.create(userBody);
  
    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User not created');
    }
  
    return user;
};

/**
 * @description Get a user by id 
 * @param userId - The user id to get the user from 
 * @returns {Promise<IUser>} Returns a promise that resolves when the user is found
 */
const getUserById = async (userId: string): Promise<IUser> => {
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    return user;
};

/**
 * @description Get a user by email
 * @param {string} email - The user email to get the user from 
 * @returns {Promise<object>} Returns a promise that resolves when the user is found
 */
const getUserByEmail = async (email: string): Promise<IUser> => {
    const user = await User.findOne({ email });
  
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
  
    return user;
};

/**
 * @description Update a user by id
 * @param {string} userId - The user id to update
 * @param {object} updateBody - The user body to update
 * @param {string[]} exclude - The user fields to exclude
 * @returns {Promise<object>} Returns a promise that resolves when the user is updated
 */
const updateUserById = async (
    userId: string,
    updateBody: any,
    exclude: any[]
): Promise<any> => {
    const user = await getUserById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    await Object.assign(user, updateBody);
    await user.save();
    return {
        ...user,
        createdAt: undefined,
    };
};

/**
 * @description Delete a user by id
 * @param userId The id of the user to delete
 * @returns {Promise<IUser | null>} Returns a promise that resolves when the user is deleted
 */
const deleteUserById = async (userId: string): Promise<IUser | null> => {
    const user = await User.findByIdAndDelete(userId);
  
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
  
    logger.info('User deleted successfully');
    return user;
  };

/**
 * @description Query users by their attributes
 * @param {number} limit - The number of users to return
 * @param {number} page - The page of users to return
 * @param {string[]} where - The user attributes to query
 * @param {string[]} include - The user attributes to include
 * @param {string[]} exclude - The user attributes to exclude
 * @returns {Promise<object>} Returns a promise that resolves when the users are queried
 */
const queryUsers = async (
    limit: number,
    page: number,
    where: any,
    include: string[] = [],
    exclude: string[] = []
): Promise<any> => {
    page = page || 1;
    limit = limit || 20;

    const usersCount = await User.estimatedDocumentCount(where);
    const users = await User.find(where)
        .skip((page - 1) * limit)
        .limit(limit)
        .select([include.join(' '), exclude.join(' ')].join(' '));
    
    const count = users.length;
    const totalPages = Math.round(usersCount / count) || 0;
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    const nextPage = hasNextPage ? page + 1 : null;
    const previousPage = hasPreviousPage ? page - 1 : null;
    return {
        users,
        page,
        limit,
        count,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        nextPage,
        previousPage,
    };
}

export const userService = {
    isEmailTaken,
    createUser,
    getUserById,
    getUserByEmail,
    updateUserById,
    deleteUserById,
    queryUsers,
};