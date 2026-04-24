import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HorariosService } from '../horarios/horarios.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { HORARIOS_DISPONIBLES, formatearIdReserva } from '../common/constants';

@Injectable()
export class ReservasService {
  constructor(
    private prisma: PrismaService,
    private horariosService: HorariosService,
  ) {}

  private parseFechaLocal(fecha: string): Date {
    const [anio, mes, dia] = fecha.split('-').map(Number);
    const fechaReserva = new Date(anio, mes - 1, dia);

    if (isNaN(fechaReserva.getTime())) {
      throw new BadRequestException('Formato de fecha inválido. Use YYYY-MM-DD');
    }

    return fechaReserva;
  }

  /**
   * Crea una nueva reserva con todas las validaciones necesarias
   */
  async crearReserva(createReservaDto: CreateReservaDto) {
    const { fecha, hora, numeroPersonas, visitantes, ...datosReserva } = createReservaDto;

    // 1️⃣ Validar que el horario exista en el sistema
    if (!HORARIOS_DISPONIBLES.includes(hora)) {
      throw new BadRequestException(`El horario ${hora} no está disponible`);
    }

    // Convertir fecha string a Date local para evitar desplazamiento de zona horaria
    const fechaReserva = this.parseFechaLocal(fecha);

    // 2️⃣ Validar que la fecha no sea pasada
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaReserva < hoy) {
      throw new BadRequestException('No se pueden hacer reservas para fechas pasadas');
    }

    // 3️⃣ Verificar disponibilidad del horario
    const disponibilidad = await this.horariosService.verificarDisponibilidad(
      fechaReserva,
      hora,
      numeroPersonas,
    );

    if (!disponibilidad.disponible) {
      throw new BadRequestException(disponibilidad.mensaje);
    }

    // 4️⃣ Validar que el número de visitantes coincida
    if (visitantes.length > numeroPersonas) {
      throw new BadRequestException(
        'El número de visitantes no puede ser mayor al número de personas declarado',
      );
    }

    console.log('Datos de la reserva:', {
      fecha: fechaReserva,
      hora,
      numeroPersonas,
      visitantes,
    });

    // 5️⃣ Crear la reserva con los visitantes
    try {
      const reserva = await this.prisma.reserva.create({
        data: {
          ...datosReserva,
          fecha: fechaReserva,
          hora,
          numeroPersonas,
          visitantes: {
            createMany: {
              data: visitantes,
            },
          },
        },
        include: {
          visitantes: true,
        },
      });

      return {
        estado: 'confirmado',
        idReserva: formatearIdReserva(reserva.id),
        reservaIdNumerico: reserva.id,
        mensaje: 'Reserva confirmada exitosamente. Recibirás un correo de confirmación.',
        reserva: {
          id: formatearIdReserva(reserva.id),
          fecha: reserva.fecha,
          hora: reserva.hora,
          numeroPersonas: reserva.numeroPersonas,
          responsable: reserva.nombreResponsable,
        },
      };
    } catch (error) {
      throw new BadRequestException('Error al crear la reserva. Intente nuevamente.');
    }
  }

  /**
   * Obtiene una reserva por ID
   */
  async obtenerReservaPorId(id: string) {
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
   * Obtiene todas las reservas (filtro opcional por fecha)
   */
  async obtenerReservas(fecha?: Date) {
    const where = fecha
      ? {
          fecha: {
            gte: new Date(fecha.setHours(0, 0, 0, 0)),
            lte: new Date(fecha.setHours(23, 59, 59, 999)),
          },
        }
      : {};

    return this.prisma.reserva.findMany({
      where,
      include: {
        visitantes: true,
      },
      orderBy: [{ fecha: 'asc' }, { hora: 'asc' }],
    });
  }
}
