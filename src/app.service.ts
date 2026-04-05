import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getInfo() {
    return {
      nombre: 'API Sistema de Reservas - Museo',
      version: '1.0.0',
      estado: 'activo',
      museo: {
        nombre: this.configService.get('MUSEO_NOMBRE'),
        direccion: this.configService.get('MUSEO_DIRECCION'),
        telefono: this.configService.get('MUSEO_TELEFONO'),
      },
      endpoints: {
        horarios: '/horarios/disponibles?fecha=YYYY-MM-DD',
        reservas: 'POST /reservas',
        admin: '/admin/reservas?fecha=YYYY-MM-DD',
        feedback: 'POST /feedback',
        health: '/health',
      },
    };
  }
}
