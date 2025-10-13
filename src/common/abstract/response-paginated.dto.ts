import { IPaginatedResponse } from '../interface/paginated-response.interface';

export class ResponsePaginatedDto<T> implements IPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;

  constructor(data: T[], page: number, limit: number) {
    this.data = data;
    this.total = data.length;
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(this.total / this.limit);
  }
}
