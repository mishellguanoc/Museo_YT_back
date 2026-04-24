import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  /**
   * Obtiene todas las reservas para una fecha específica
   */
  async obtenerReservasPorFecha(fecha: Date) {
    const fechaInicio = new Date(fecha);
    fechaInicio.setHours(0, 0, 0, 0);

    const fechaFin = new Date(fecha);
    fechaFin.setHours(23, 59, 59, 999);

    return await this.prisma.reserva.findMany({
      where: {
        fecha: {
          gte: fechaInicio,
          lte: fechaFin,
        },
      },
      include: {
        visitantes: true,
      },
      orderBy: {
        hora: 'asc',
      },
    });

    // Formatear la respuesta para el administrador
   /*  return reservas.map((reserva) => ({
      id: reserva.id,
      hora: reserva.hora,
      responsable: reserva.nombreResponsable,
      cedula: reserva.cedula,
      personas: reserva.numeroPersonas,
      telefono: reserva.telefono,
      correo: reserva.correo,
      estado: reserva.estado,
      visitantes: reserva.visitantes.length,
      createdAt: reserva.createdAt,
    })); */
  }

  /**
   * Obtiene una reserva completa con todos sus detalles
   */
  async obtenerDetalleReserva(id: string) {
    const reserva = await this.prisma.reserva.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        visitantes: true,
        feedback: true,
      },
    });

    if (!reserva) {
      throw new NotFoundException('Reserva no encontrada');
    }

    return reserva;
  }

  /**
   * Cancela una reserva y libera los cupos
   */
  async cancelarReserva(id: string) {
    const reserva = await this.prisma.reserva.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!reserva) {
      throw new NotFoundException('Reserva no encontrada');
    }

    if (reserva.estado === 'CANCELADO') {
      return {
        mensaje: 'La reserva ya estaba cancelada',
        estado: 'cancelado',
      };
    }

    // Actualizar estado a cancelado
    const reservaActualizada = await this.prisma.reserva.update({
      where: { id: parseInt(id, 10) },
      data: {
        estado: 'CANCELADO',
      },
    });

    return {
      mensaje: 'Reserva cancelada exitosamente',
      cuposLiberados: reservaActualizada.numeroPersonas,
      estado: 'cancelado',
    };
  }

  /**
   * Obtiene estadísticas generales
   */
  async obtenerEstadisticas() {
    const totalReservas = await this.prisma.reserva.count();
    const reservasConfirmadas = await this.prisma.reserva.count({
      where: { estado: 'CONFIRMADO' },
    });
    const reservasCanceladas = await this.prisma.reserva.count({
      where: { estado: 'CANCELADO' },
    });

    const totalVisitantes = await this.prisma.visitante.count();

    const feedbackTotal = await this.prisma.feedback.count();
    const promedioCalificacion = await this.prisma.feedback.aggregate({
      _avg: {
        calificacion: true,
      },
    });

    return {
      reservas: {
        total: totalReservas,
        confirmadas: reservasConfirmadas,
        canceladas: reservasCanceladas,
      },
      visitantes: {
        total: totalVisitantes,
      },
      feedback: {
        total: feedbackTotal,
        promedioCalificacion: promedioCalificacion._avg.calificacion || 0,
      },
    };
  }

  /**
   * Obtiene el resumen de disponibilidad para los próximos días
   */
  async obtenerResumenProximosDias(dias: number = 7) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const fechaFinal = new Date(hoy);
    fechaFinal.setDate(fechaFinal.getDate() + dias);

    const reservas = await this.prisma.reserva.findMany({
      where: {
        fecha: {
          gte: hoy,
          lt: fechaFinal,
        },
        estado: 'CONFIRMADO',
      },
      select: {
        fecha: true,
        numeroPersonas: true,
      },
    });

    // Agrupar por fecha
    const resumenPorFecha = reservas.reduce(
      (acc, reserva) => {
        const fechaKey = reserva.fecha.toISOString().split('T')[0];
        acc[fechaKey] = (acc[fechaKey] || 0) + reserva.numeroPersonas;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(resumenPorFecha).map(([fecha, personas]) => ({
      fecha,
      totalPersonas: personas,
    }));
  }
}
