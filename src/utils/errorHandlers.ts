/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import ApiError from './ApiError.ts';

/**
 * Middleware to handle 404 errors for routes that are not found.
 * Creates a new instance of ApiError with a 404 status code and "Route Not Found" message.
 * Passes the error to the next middleware, typically the error handler.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function.
 */
export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction): void => {
  const error = new ApiError(404, 'Route Not Found');
  next(error);
};

/**
 * Middleware to handle errors.
 * Handles Mongoose validation, duplicate key, and cast errors specifically.
 * If an ApiError is caught, it sends a structured response to the client.
 * Otherwise, it logs the error and returns a generic 500 Internal Server Error.
 *
 * @param err - The error object.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function.
 */
export const errorHandler: ErrorRequestHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val: any) => val.message);
    err = new ApiError(400, 'Validation Error', messages);
  }

  // Handle Mongoose duplicate key errors
  if (err.code && err.code === 11000) {
    const message = 'Duplicate field value entered';
    err = new ApiError(400, message);
  }

  // Handle Mongoose cast errors
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    err = new ApiError(404, message);
  }

  // If the error is an instance of ApiError, send the structured response
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors,
    });
  }

  // Log unexpected errors and respond with a generic 500 error
  console.error(err);

  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
};
