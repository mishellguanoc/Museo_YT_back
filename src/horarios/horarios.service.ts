import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HORARIOS_DISPONIBLES, MAX_PERSONAS_POR_HORARIO } from '../common/constants';

@Injectable()
export class HorariosService {
  constructor(private prisma: PrismaService) {}

  /**
   * Obtiene los horarios disponibles para una fecha específica
   * Calcula los cupos disponibles considerando las reservas existentes
   */
  async obtenerHorariosDisponibles(fecha: Date) {
    // Convertir fecha a formato Date para la consulta
    const fechaInicio = new Date(fecha);
    fechaInicio.setHours(0, 0, 0, 0);

    const fechaFin = new Date(fecha);
    fechaFin.setHours(23, 59, 59, 999);

    // Obtener todas las reservas confirmadas para esa fecha
    const reservas = await this.prisma.reserva.findMany({
      where: {
        fecha: {
          gte: fechaInicio,
          lte: fechaFin,
        },
        estado: 'CONFIRMADO',
      },
      select: {
        hora: true,
        numeroPersonas: true,
      },
    });

    // Agrupar reservas por hora y sumar personas
    const personasPorHora = reservas.reduce(
      (acc, reserva) => {
        const hora = reserva.hora;
        acc[hora] = (acc[hora] || 0) + reserva.numeroPersonas;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Calcular disponibilidad para cada horario
    const horariosConDisponibilidad = HORARIOS_DISPONIBLES.map((hora) => {
      const personasReservadas = personasPorHora[hora] || 0;
      const cuposDisponibles = MAX_PERSONAS_POR_HORARIO - personasReservadas;

      return {
        hora,
        cuposDisponibles: Math.max(0, cuposDisponibles),
        cuposOcupados: personasReservadas,
        total: MAX_PERSONAS_POR_HORARIO,
      };
    });

    return horariosConDisponibilidad;
  }

  /**
   * Verifica si un horario específico tiene cupos disponibles
   */
  async verificarDisponibilidad(fecha: Date, hora: string, numeroPersonas: number) {
    const horarios = await this.obtenerHorariosDisponibles(fecha);
    const horario = horarios.find((h) => h.hora === hora);

    if (!horario) {
      return {
        disponible: false,
        mensaje: 'Horario no válido',
      };
    }

    if (horario.cuposDisponibles < numeroPersonas) {
      return {
        disponible: false,
        mensaje: `Solo hay ${horario.cuposDisponibles} cupos disponibles`,
        cuposDisponibles: horario.cuposDisponibles,
      };
    }

    return {
      disponible: true,
      mensaje: 'Horario disponible',
      cuposDisponibles: horario.cuposDisponibles,
    };
  }
}
