export class ApiResponse {
  public success: boolean;
  constructor(
    public code: number,
    public message: string,
    public data: any
  ) {
    this.success = code < 400;
  }
}
