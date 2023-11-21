import { RequestHandler } from 'express';

/**
 * @description This function is used to handle async/await errors
 * @param {RequestHandler} fn - The function to be handled by the handler. This function should be an async function.
 * @param {Request} req - The request object. 
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function.
 * @returns {RequestHandler} A function that handles async/await errors.
 * @example Asyncly(async (req, res, next) => { const user = await User.findById(req.params.id); res.status(200).json({ user }); })); 
 */
function Asyncly(fn: RequestHandler) {
    const handler: RequestHandler = (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((err) => next(err));
    };
    return handler;
}

export default Asyncly;