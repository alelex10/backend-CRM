import { IPaginatedResponse } from '../interface/paginated-response.interface';

export class ResponsePaginatedDto<T> implements IPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;

  constructor(data: T[], page: number, limit: number, totalPages: number) {
    this.data = data;
    this.total = data.length;
    this.page = page;
    this.limit = limit;
    this.totalPages = totalPages;
  }
}
