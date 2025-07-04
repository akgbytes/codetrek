export class ApiResponse<T> {
  public success: boolean;
  constructor(
    public code: number,
    public message: string,
    public data: T
  ) {
    this.success = code < 400;
  }
}
