import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  /**
   * POST /feedback
   * Registra feedback de una visita
   */
  @Post()
  async crear(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.crearFeedback(createFeedbackDto);
  }

  /**
   * GET /feedback
   * Obtiene todos los feedbacks (admin)
   */
  @Get()
  async obtenerTodos() {
    return this.feedbackService.obtenerTodosFeedbacks();
  }

  /**
   * GET /feedback/reserva/:reservaId
   * Obtiene el feedback de una reserva específica
   */
  @Get('reserva/:reservaId')
  async obtenerPorReserva(@Param('reservaId') reservaId: string) {
    return this.feedbackService.obtenerFeedbackPorReserva(reservaId);
  }

  /**
   * GET /feedback/estadisticas
   * Obtiene estadísticas generales de feedback
   */
  @Get('estadisticas')
  async obtenerEstadisticas() {
    return this.feedbackService.obtenerEstadisticas();
  }
}
