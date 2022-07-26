export class ResponseResult {
  data: any;
  code: number;
  message: string;

  constructor(data: any, code = 100, message = '') {
    this.data = data;
    this.code = code;
    this.message = message;
  }
}
