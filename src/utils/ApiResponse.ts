export interface IApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}
/**
 * Creates a response object to be sent back to the client.
 *
 * @param {number} statusCode - The HTTP status code of the response.
 * @param {Object} data - The data to include in the response.
 * @param {string} [message='Success'] - The message to include in the response.
 * @returns {Object} - The response object with status code, data, message, and success flag.
 */
export class ApiResponse<T> implements IApiResponse<T> {
  public statusCode: number;
  public data: T;
  public message: string;
  public success: boolean;

  constructor(statusCode: number, data: T, message: string = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400; // Success flag based on status code
  }
}

export default ApiResponse;
