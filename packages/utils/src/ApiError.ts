export class ApiError<T = unknown> extends Error {
  success: boolean;
  constructor(
    public code: number,
    message: string,
    public data: T | null = null
  ) {
    super(message);
    this.success = false;
    this.data = data;
    this.name = "Api Error";
    Error.captureStackTrace(this, this.constructor);
  }
}
