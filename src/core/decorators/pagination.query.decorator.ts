import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Pagination } from '../models/pagination.model';

export const QueryPagination = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    request.query;
    const pageSize = Number.parseInt(request.query['pageSize'] as string);
    const page = Number.parseInt(request.query['page'] as string);
    return new Pagination(pageSize, page);
  },
);
