import {
  IsString,
  IsEmail,
  IsDateString,
  IsInt,
  Min,
  Max,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  Matches,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';

class VisitanteDto {
  @IsString()
  @Length(3, 100)
  nombre: string;

  @IsString()
  @Length(5, 20)
  cedula: string;
}

export class CreateReservaDto {
  @IsString()
  @Length(3, 100)
  nombreResponsable: string;

  @IsString()
  @Length(5, 20)
  cedula: string;

  @IsEmail()
  correo: string;

  @IsString()
  @Matches(/^[+]?[\d\s-()]+$/, { message: 'Formato de teléfono inválido' })
  telefono: string;

  @IsDateString()
  fecha: string; // Formato: YYYY-MM-DD

  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Formato de hora inválido (HH:mm)' })
  hora: string; // Formato: HH:mm

  @IsInt()
  @Min(1)
  @Max(10)
  numeroPersonas: number;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => VisitanteDto)
  visitantes: VisitanteDto[];
}
