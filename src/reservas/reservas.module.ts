import { Module } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { ReservasController } from './reservas.controller';
import { HorariosModule } from '../horarios/horarios.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [HorariosModule, MailModule],
  controllers: [ReservasController],
  providers: [ReservasService],
  exports: [ReservasService],
})
export class ReservasModule {}
