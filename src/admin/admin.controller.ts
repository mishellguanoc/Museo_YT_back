import { Controller, Get, Patch, Param, Query, BadRequestException, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * GET /admin/reservas?fecha=2026-03-15
   * Obtiene todas las reservas de una fecha
   */
  @Get('reservas')
  async obtenerReservasPorFecha(@Query('fecha') fechaStr: string) {
    if (!fechaStr) {
      throw new BadRequestException('El parámetro "fecha" es requerido (formato: YYYY-MM-DD)');
    }

    const fecha = new Date(fechaStr);
    if (isNaN(fecha.getTime())) {
      throw new BadRequestException('Formato de fecha inválido. Use YYYY-MM-DD');
    }

    return this.adminService.obtenerReservasPorFecha(fecha);
  }

  /**
   * GET /admin/reservas/:id
   * Obtiene el detalle completo de una reserva
   */
  @Get('reservas/:id')
  async obtenerDetalleReserva(@Param('id') id: string) {
    return this.adminService.obtenerDetalleReserva(id);
  }

  /**
   * PATCH /admin/reservas/:id/cancelar
   * Cancela una reserva
   */
  @Patch('reservas/:id/cancelar')
  async cancelarReserva(@Param('id') id: string) {
    return this.adminService.cancelarReserva(id);
  }

  /**
   * GET /admin/estadisticas
   * Obtiene estadísticas generales del sistema
   */
  @Get('estadisticas')
  async obtenerEstadisticas() {
    return this.adminService.obtenerEstadisticas();
  }

  /**
   * GET /admin/resumen-proximos-dias?dias=7
   * Obtiene resumen de visitantes para los próximos días
   */
  @Get('resumen-proximos-dias')
  async obtenerResumenProximosDias(@Query('dias') diasStr?: string) {
    const dias = diasStr ? parseInt(diasStr, 10) : 7;

    if (isNaN(dias) || dias < 1 || dias > 30) {
      throw new BadRequestException('El número de días debe estar entre 1 y 30');
    }

    return this.adminService.obtenerResumenProximosDias(dias);
  }
}
