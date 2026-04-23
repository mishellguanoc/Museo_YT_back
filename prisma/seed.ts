import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Crear admin por defecto
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.admin.upsert({
    where: { usuario: 'admin@museo.com' },
    update: {},
    create: {
      usuario: 'admin@museo.com',
      password: hashedPassword,
      nombre: 'Administrador Principal',
    },
  });

  console.log('✅ Admin creado:', admin);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
