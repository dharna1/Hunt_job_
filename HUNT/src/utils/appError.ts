export class AppError {
  private statusCode: number;
  private error: string;
  private message: any;

  public constructor(statusCode: number) {
    this.error = '';
    this.message = [];
    this.statusCode = statusCode;
  }

  public getMessages(): any {
    return this.message;
  }

  public isErrors(): any {
    return this.message.length > 0;
  }

  public setErrors(error = 'Bad Request', message: []): any {
    this.error = error;
    this.message = message;
    return this;
  }

  public addParamError(message: string): any {
    this.error = 'Bad Request';
    this.message.push(message);
    return this;
  }

  public addServerError(message: string): any {
    this.error = 'Server Error';
    this.message.push(message);
    return this;
  }

  public addDbError(message: string): any {
    this.error = 'DB Error';
    this.message.push(message);
    return this;
  }

  public addCustomError(error = 'Bad Request', message: string): any {
    this.error = error;
    this.message.push(message);
    return this;
  }

  public getStatusCode(): any {
    return this.statusCode;
  }
}
