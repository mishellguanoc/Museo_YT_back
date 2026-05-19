import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  
  async onModuleInit() {
    try {
      console.log('Conectando a Prisma...');
      console.log('DATABASE_URL existe:', !!process.env.DATABASE_URL);

      await this.$connect();

      console.log('Prisma conectado correctamente');
    } catch (error) {
      console.error('ERROR PRISMA:', error);
      throw error;
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }
}