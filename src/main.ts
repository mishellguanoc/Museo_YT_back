import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  

  // Habilitar CORS para frontend
  app.enableCors({
    origin: '*', // En producción, especifica el dominio del frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  // Puerto dinámico para Render
  await app.listen(process.env.PORT || 3000);

  console.log(`Servidor corriendo en puerto ${process.env.PORT || 3000}`);


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

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(` API del Museo ejecutándose en: http://localhost:${port}`);
  console.log(` Base de datos: PostgreSQL (Supabase)`);


bootstrap();
}
