import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { MailService } from '../mail/mail.service';
import { CreateReservaDto } from './dto/create-reserva.dto';

@Controller('reservas')
export class ReservasController {
  constructor(
    private readonly reservasService: ReservasService,
    private readonly mailService: MailService,
  ) {}

  /**
   * POST /reservas
   * Crear una nueva reserva
   */
  @Post()
  async crear(@Body() createReservaDto: CreateReservaDto) {
    // Crear la reserva
    const resultado = await this.reservasService.crearReserva(createReservaDto);

    // Enviar correos de confirmación (no bloqueante)
    this.enviarCorreosConfirmacion(resultado.idReserva).catch((error) => {
      console.error('Error al enviar correos:', error);
    });

    return resultado;
  }

  /**
   * GET /reservas/:id
   * Obtener una reserva específica
   */
  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    return this.reservasService.obtenerReservaPorId(id);
  }

  /**
   * Método privado para enviar correos de confirmación
   */
  private async enviarCorreosConfirmacion(reservaId: string) {
    try {
      const reserva = await this.reservasService.obtenerReservaPorId(reservaId);

      // Enviar correo al visitante
      await this.mailService.enviarConfirmacionVisitante(reserva);

      // Enviar correo al administrador
      await this.mailService.enviarNotificacionAdmin(reserva);
    } catch (error) {
      console.error('Error al enviar correos:', error);
    }
  }
}
