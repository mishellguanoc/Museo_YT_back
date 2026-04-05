export class ApiResponse<T> {
  ok: boolean;
  data?: T;
  message?: string;
  statusCode: number;
  timestamp: string;
}

export class PaginatedResponse<T> {
  ok: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  timestamp: string;
}

export class ErrorResponse {
  ok: boolean;
  message: string;
  error: string;
  statusCode: number;
  timestamp: string;
}
