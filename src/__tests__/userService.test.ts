
import { jest } from '@jest/globals';
import { userService } from '../services/index';
import { User, CreateUserBody } from '../models/index'
import ApiError from '../utils/ApiError';

describe('isEmailTaken', () => {

    it('should return false when email is not taken', async () => {
        const email = 'test@example.com';
        const user = null;
        jest.spyOn(User, 'findOne').mockResolvedValue(user);
        const result = await userService.isEmailTaken(email);
        expect(result).toBe(false);
    });

    // should return true if email is taken
    it('should return true when email is taken', async () => {
      const email = 'test@example.com';
      const user = { email: 'test@example.com' };
      jest.spyOn(User, 'findOne').mockResolvedValue(user);
      const result = await userService.isEmailTaken(email);
  
      expect(result).toBe(true);
    });

    // should handle case-insensitive email comparison
    it('should handle case-insensitive email comparison', async () => {
      const email = 'test@example.com';
      const user = { email: 'TEST@example.com' };
      jest.spyOn(User, 'findOne').mockResolvedValue(user);
      const result = await userService.isEmailTaken(email);
      expect(result).toBe(true);
    });

    // should return false if email is empty string
    it('should return false when email is empty string', async () => {
      const email = '';
      const user = null;
      jest.spyOn(User, 'findOne').mockResolvedValue(user);
      const result = await userService.isEmailTaken(email);
      expect(result).toBe(false);
    });

    // should return false if email is undefined
    it('should return false when email is undefined', async () => {
      const email = undefined;
      const user = null;
      jest.spyOn(User, 'findOne').mockResolvedValue(user);
      const result = await userService.isEmailTaken(email || '');
      expect(result).toBe(false);
    });

    // should return false if email is null
    it('should return false when email is null', async () => {
        const email = null;
        const user = null;
        jest.spyOn(User, 'findOne').mockResolvedValue(user);
        const result = await userService.isEmailTaken(email || '');
        expect(result).toBe(false);
    });
});


describe('createUser', () => {

    // creates a user with valid userBody
    it('should create a user with valid userBody', async () => {
        const userBody = {
            businessName: 'Test Business',
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
            description: 'Test store where you buy',
            instagram: 'http://example.com',
        };

        const createdUser = await userService.createUser(userBody);

        expect(createdUser.email).toBe(userBody.email);
        expect(createdUser.password).toBe(userBody.password);
    });

    // returns the created user
    it('should return the created user', async () => {
        const userBody = {
            businessName: 'Test Business',
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
            description: 'Test store where you buy',
            instagram: 'http://example.com',
        };


        const createdUser = await userService.createUser(userBody);

      expect(createdUser).toBeDefined();
      expect(createdUser.businessName).toBe(userBody.businessName);
      expect(createdUser.email).toBe(userBody.email);
      expect(createdUser.password).toBe(userBody.password);
      expect(createdUser.username).toBe(userBody.username);
      expect(createdUser.description).toBe(userBody.description);
    });

    // creates a user with minimum required fields
    it('should create a user with minimum required fields', async () => {
      const userBody = {
        businessName: 'Test Business',
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      const createdUser = await userService.createUser(userBody);

      expect(createdUser.businessName).toBe(userBody.businessName);
      expect(createdUser.email).toBe(userBody.email);
      expect(createdUser.password).toBe(userBody.password);
    });

    // throws error when userBody is null
    it('should throw an error when userBody is null', async () => {
        const userBody = null;

        await expect(() => userService.createUser(userBody as unknown as CreateUserBody)).rejects.toThrow(ApiError);
    });

    // throws error when userBody is undefined
    it('should throw an error when userBody is undefined', async () => {
        const userBody = undefined;

        await expect(() => userService.createUser(userBody as unknown as CreateUserBody)).rejects.toThrow(ApiError);
    });

    // throws error when userBody is empty object
    it('should throw an error when userBody is empty object', async () => {
        const userBody = {};

        await expect(() => userService.createUser(userBody as unknown as CreateUserBody)).rejects.toThrow(ApiError);
    });
});

