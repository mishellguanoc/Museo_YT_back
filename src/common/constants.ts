// Constantes del sistema
export const HORARIOS_DISPONIBLES = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
];

export const MAX_PERSONAS_POR_HORARIO = 10;

/**
 * Formatea el ID numérico de la reserva a formato "MAYT-001"
 */
export function formatearIdReserva(id: number): string {
  return `MAYT-${String(id).padStart(3, '0')}`;
}
