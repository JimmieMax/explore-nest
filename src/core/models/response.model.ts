export class ResponseResult {
  data: any;
  code: number;
  message: string;

  constructor(data: any, code = 100, message = 'successfully') {
    this.data = data;
    this.code = code;
    this.message = message;
  }
}
