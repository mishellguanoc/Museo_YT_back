import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  console.log('Iniciando aplicación...');
  console.log('PORT:', process.env.PORT);
  console.log('DATABASE_URL existe:', !!process.env.DATABASE_URL);
  
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para frontend
  app.enableCors({
    origin: '*', // En producción, especifica el dominio del frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Puerto dinámico para Render
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`API del Museo ejecutándose en puerto ${port}`);
  console.log(`Base de datos: PostgreSQL (Supabase)`);

  // Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Aplicar filtro y interceptor globalmente
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
}

bootstrap();