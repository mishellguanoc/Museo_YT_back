import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  console.log('Iniciando aplicación...');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('PORT:', process.env.PORT);
  console.log('DATABASE_URL existe:', !!process.env.DATABASE_URL);
  
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para frontend
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.FRONTEND_URL || '*' 
      : '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Validación global de DTOs - DEBE IR ANTES DE listen()
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Aplicar filtro y interceptor globalmente - DEBEN IR ANTES DE listen()
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Puerto dinámico para Render
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`✅ API del Museo ejecutándose en puerto ${port}`);
  console.log(`✅ Base de datos: PostgreSQL (Supabase)`);
  console.log(`✅ Ambiente: ${process.env.NODE_ENV || 'development'}`);
}

bootstrap();