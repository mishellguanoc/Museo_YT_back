import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  /**
   * Registra el feedback de una reserva
   */
  async crearFeedback(createFeedbackDto: CreateFeedbackDto) {
    const { idReserva, calificacion, comentario } = createFeedbackDto;

    // 1️⃣ Verificar que la reserva existe
    const reserva = await this.prisma.reserva.findUnique({
      where: { id: idReserva },
      include: {
        feedback: true,
      },
    });

    if (!reserva) {
      throw new NotFoundException('Reserva no encontrada');
    }

    // 2️⃣ Verificar que la reserva esté confirmada
    if (reserva.estado !== 'CONFIRMADO') {
      throw new BadRequestException('Solo se puede dar feedback a reservas confirmadas');
    }

    // 3️⃣ Verificar que no se haya enviado feedback anteriormente
    if (reserva.feedback) {
      throw new ConflictException('Ya se ha registrado feedback para esta reserva');
    }

    // 4️⃣ Verificar que la fecha de la reserva ya haya pasado (opcional)
    const fechaReserva = new Date(reserva.fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaReserva > hoy) {
      throw new BadRequestException('No se puede enviar feedback antes de la fecha de la visita');
    }

    // 5️⃣ Crear el feedback
    const feedback = await this.prisma.feedback.create({
      data: {
        reservaId: idReserva,
        calificacion,
        comentario: comentario || null,
      },
    });

    return {
      estado: 'guardado',
      mensaje: '¡Gracias por tu feedback!',
      feedback: {
        id: feedback.id,
        calificacion: feedback.calificacion,
        fecha: feedback.createdAt,
      },
    };
  }

  /**
   * Obtiene todos los feedbacks (para el administrador)
   */
  async obtenerTodosFeedbacks() {
    return this.prisma.feedback.findMany({
      include: {
        reserva: {
          select: {
            nombreResponsable: true,
            fecha: true,
            hora: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Obtiene el feedback de una reserva específica
   */
  async obtenerFeedbackPorReserva(reservaId: string) {
    const feedback = await this.prisma.feedback.findUnique({
      where: { reservaId },
      include: {
        reserva: {
          select: {
            nombreResponsable: true,
            fecha: true,
            hora: true,
          },
        },
      },
    });

    if (!feedback) {
      throw new NotFoundException('No se encontró feedback para esta reserva');
    }

    return feedback;
  }

  /**
   * Obtiene estadísticas de feedback
   */
  async obtenerEstadisticas() {
    const totalFeedbacks = await this.prisma.feedback.count();

    const distribucionCalificaciones = await this.prisma.feedback.groupBy({
      by: ['calificacion'],
      _count: {
        calificacion: true,
      },
      orderBy: {
        calificacion: 'desc',
      },
    });

    const promedio = await this.prisma.feedback.aggregate({
      _avg: {
        calificacion: true,
      },
    });

    return {
      total: totalFeedbacks,
      promedioCalificacion: promedio._avg.calificacion || 0,
      distribucion: distribucionCalificaciones.map((item) => ({
        estrellas: item.calificacion,
        cantidad: item._count.calificacion,
      })),
    };
  }
}
