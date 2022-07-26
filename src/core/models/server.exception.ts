import { HttpException } from '@nestjs/common';

export enum ServerExceptionCode {
  InvalidParam = 400,
  RefuseRequest = 403,
  NotSupportMethod = 405,
  NotAcceptable = 406,
  ServiceError = 500,
  ServiceBizErr = 1270,
  TokenExpired = 15012010,
  LoginExpired = 1006,
  RpcNotFoundService = 1202,
  RpcNotData = 1203,
  DBOperateErr = 1400,
  DBInsertErr = 1401,
  DBUpdateErr = 1402,
  DBDeleteErr = 1403,
  DBQueryErr = 1404,
  RedisTimeOut = 1410,
  HazelcastErr = 1411,
  MQSendFail = 1420,
  CurrentLimitingWarning = 1600,
  CurrentLimitingDowngrading = 1601,
  InvalidPage = 1900,
}

export class ServerException extends HttpException {
  code: ServerExceptionCode;
  constructor(code: ServerExceptionCode, message: string) {
    super(message, code);
    this.code = code;
  }
}
