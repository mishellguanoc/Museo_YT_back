import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { HorariosService } from './horarios.service';

@Controller('horarios')
export class HorariosController {
  constructor(private readonly horariosService: HorariosService) {}

  /**
   * GET /horarios/disponibles?fecha=2026-03-15
   * Retorna los horarios disponibles para una fecha específica
   */
  @Get('disponibles')
  async obtenerDisponibles(@Query('fecha') fechaStr: string) {
    if (!fechaStr) {
      throw new BadRequestException('El parámetro "fecha" es requerido (formato: YYYY-MM-DD)');
    }

    // Validar formato de fecha
    const fecha = new Date(fechaStr);
    if (isNaN(fecha.getTime())) {
      throw new BadRequestException('Formato de fecha inválido. Use YYYY-MM-DD');
    }

    // Validar que la fecha no sea pasada
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fecha < hoy) {
      throw new BadRequestException('No se pueden consultar fechas pasadas');
    }

    return this.horariosService.obtenerHorariosDisponibles(fecha);
  }

  /**
   * GET /horarios/verificar?fecha=2026-03-15&hora=10:00&personas=5
   * Verifica si hay disponibilidad para un horario específico
   */
  @Get('verificar')
  async verificarDisponibilidad(
    @Query('fecha') fechaStr: string,
    @Query('hora') hora: string,
    @Query('personas') personasStr: string,
  ) {
    if (!fechaStr || !hora || !personasStr) {
      throw new BadRequestException('Faltan parámetros requeridos: fecha, hora, personas');
    }

    const fecha = new Date(fechaStr);
    const numeroPersonas = parseInt(personasStr, 10);

    if (isNaN(fecha.getTime())) {
      throw new BadRequestException('Formato de fecha inválido');
    }

    if (isNaN(numeroPersonas) || numeroPersonas < 1) {
      throw new BadRequestException('El número de personas debe ser mayor a 0');
    }

    return this.horariosService.verificarDisponibilidad(fecha, hora, numeroPersonas);
  }
}
