/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IApiError {
  statusCode: number;
  message: string;
  success: boolean;
  errors: Array<any>;
  stack?: string;
}

export class ApiError extends Error implements IApiError {
  public statusCode: number;
  public success: boolean;
  public errors: Array<any>;

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors: Array<any> = [],
    stack?: string,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Creates a new ApiError instance with the specified status code and message.
   */
  static createError(
    statusCode: number,
    message: string,
    errors: Array<any> = [],
  ): ApiError {
    return new ApiError(statusCode, message, errors);
  }

  /**
   * Creates a bad request error (HTTP 400).
   */
  static badRequest(message: string, errors: Array<any> = []): ApiError {
    return ApiError.createError(400, message, errors);
  }

  /**
   * Creates a not found error (HTTP 404).
   */
  static notFound(message: string, errors: Array<any> = []): ApiError {
    return ApiError.createError(404, message, errors);
  }

  /**
   * Creates a forbidden error (HTTP 403).
   */
  static forbidden(message: string, errors: Array<any> = []): ApiError {
    return ApiError.createError(403, message, errors);
  }

  /**
   * Creates an unauthorized error (HTTP 401).
   */
  static unauthorized(message: string, errors: Array<any> = []): ApiError {
    return ApiError.createError(401, message, errors);
  }

  /**
   * Creates a conflict error (HTTP 409).
   */
  static conflict(message: string, errors: Array<any> = []): ApiError {
    return ApiError.createError(409, message, errors);
  }

  /**
   * Creates an internal server error (HTTP 500).
   */
  static internal(message: string, errors: Array<any> = []): ApiError {
    return ApiError.createError(500, message, errors);
  }
}

export default ApiError;
