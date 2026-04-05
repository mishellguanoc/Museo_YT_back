import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;

        // Si ya tiene formato de paginación
        if (data.data && data.total !== undefined) {
          return {
            ok: true,
            data: data.data,
            total: data.total,
            page: data.page || 1,
            limit: data.limit || 10,
            totalPages: data.totalPages,
            timestamp: new Date().toISOString(),
          };
        }

        // Respuesta simple
        return {
          ok: true,
          data: data,
          statusCode,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
