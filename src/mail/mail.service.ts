import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: parseInt(this.configService.get('MAIL_PORT'), 10),
      secure: false, // true para 465, false para otros puertos
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASSWORD'),
      },
    });
  }

  /**
   * Envía correo de confirmación al visitante
   */
  async enviarConfirmacionVisitante(reserva: any) {
    const fechaFormateada = new Date(reserva.fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const htmlContent = this.generarHtmlVisitante(reserva, fechaFormateada);

    try {
      await this.transporter.sendMail({
        from: this.configService.get('MAIL_FROM'),
        to: reserva.correo,
        subject: '✅ Confirmación de Visita al Museo',
        html: htmlContent,
      });

      console.log(`✉️ Correo de confirmación enviado a: ${reserva.correo}`);
    } catch (error) {
      console.error('Error al enviar correo al visitante:', error);
      throw error;
    }
  }

  /**
   * Envía notificación al administrador sobre nueva reserva
   */
  async enviarNotificacionAdmin(reserva: any) {
    const adminEmail = this.configService.get('ADMIN_EMAIL');

    const fechaFormateada = new Date(reserva.fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const htmlContent = this.generarHtmlAdmin(reserva, fechaFormateada);

    try {
      await this.transporter.sendMail({
        from: this.configService.get('MAIL_FROM'),
        to: adminEmail,
        subject: '🔔 Nueva Reserva Registrada',
        html: htmlContent,
      });

      console.log(`✉️ Notificación enviada al administrador: ${adminEmail}`);
    } catch (error) {
      console.error('Error al enviar correo al administrador:', error);
      throw error;
    }
  }

  /**
   * Genera el HTML del correo para el visitante
   */
  private generarHtmlVisitante(reserva: any, fechaFormateada: string): string {
    const museoNombre = this.configService.get('MUSEO_NOMBRE');
    const museoDireccion = this.configService.get('MUSEO_DIRECCION');
    const museoTelefono = this.configService.get('MUSEO_TELEFONO');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #667eea; border-radius: 5px; }
          .info-row { margin: 10px 0; }
          .label { font-weight: bold; color: #667eea; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .btn { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Reserva Confirmada</h1>
            <p>Tu visita ha sido registrada exitosamente</p>
          </div>
          
          <div class="content">
            <p>Hola <strong>${reserva.nombreResponsable}</strong>,</p>
            <p>Tu reserva para visitar el <strong>${museoNombre}</strong> ha sido confirmada.</p>
            
            <div class="info-box">
              <h3 style="margin-top: 0; color: #667eea;">📋 Detalles de tu Reserva</h3>
              <div class="info-row">
                <span class="label">📅 Fecha:</span> ${fechaFormateada}
              </div>
              <div class="info-row">
                <span class="label">🕐 Hora:</span> ${reserva.hora}
              </div>
              <div class="info-row">
                <span class="label">👥 Número de personas:</span> ${reserva.numeroPersonas}
              </div>
              <div class="info-row">
                <span class="label">🎫 Código de reserva:</span> ${reserva.id}
              </div>
            </div>

            <div class="info-box">
              <h3 style="margin-top: 0; color: #667eea;">📍 Información del Museo</h3>
              <div class="info-row">
                <span class="label">Dirección:</span> ${museoDireccion}
              </div>
              <div class="info-row">
                <span class="label">Teléfono:</span> ${museoTelefono}
              </div>
            </div>

            <div class="info-box" style="border-left-color: #f39c12;">
              <h3 style="margin-top: 0; color: #f39c12;">⚠️ Importante</h3>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Por favor, llega <strong>10 minutos antes</strong> de tu horario</li>
                <li>Presenta este correo o tu código de reserva en la entrada</li>
                <li>Si necesitas cancelar, contáctanos con anticipación</li>
              </ul>
            </div>

            <p style="margin-top: 30px;">¡Esperamos verte pronto! 🎨</p>
          </div>
          
          <div class="footer">
            <p>Este es un correo automático, por favor no responder.</p>
            <p>${museoNombre} • ${museoTelefono}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Genera el HTML del correo para el administrador
   */
  private generarHtmlAdmin(reserva: any, fechaFormateada: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2c3e50; color: white; padding: 20px; text-align: center; border-radius: 5px; }
          .content { background: #ecf0f1; padding: 20px; margin-top: 20px; border-radius: 5px; }
          .info-row { margin: 15px 0; padding: 10px; background: white; border-radius: 3px; }
          .label { font-weight: bold; color: #2c3e50; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🔔 Nueva Reserva Registrada</h2>
          </div>
          
          <div class="content">
            <h3>Detalles de la Reserva:</h3>
            
            <div class="info-row">
              <span class="label">Responsable:</span> ${reserva.nombreResponsable}
            </div>
            <div class="info-row">
              <span class="label">Cédula:</span> ${reserva.cedula}
            </div>
            <div class="info-row">
              <span class="label">Correo:</span> ${reserva.correo}
            </div>
            <div class="info-row">
              <span class="label">Teléfono:</span> ${reserva.telefono}
            </div>
            <div class="info-row">
              <span class="label">Fecha:</span> ${fechaFormateada}
            </div>
            <div class="info-row">
              <span class="label">Hora:</span> ${reserva.hora}
            </div>
            <div class="info-row">
              <span class="label">Número de personas:</span> ${reserva.numeroPersonas}
            </div>
            <div class="info-row">
              <span class="label">ID de reserva:</span> ${reserva.id}
            </div>
            
            <p style="margin-top: 20px; color: #7f8c8d;">
              Esta reserva ha sido confirmada y el visitante ha recibido un correo de confirmación.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
