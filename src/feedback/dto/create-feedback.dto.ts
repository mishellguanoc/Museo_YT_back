import { IsString, IsInt, Min, Max, IsOptional, Length } from 'class-validator';

export class CreateFeedbackDto {
  @IsString()
  @Length(10, 50)
  idReserva: string;

  @IsInt()
  @Min(1)
  @Max(5)
  calificacion: number;

  @IsOptional()
  @IsString()
  @Length(10, 500)
  comentario?: string;
}
