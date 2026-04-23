import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Valida credenciales del admin y retorna JWT
   */
  async login(usuario: string, password: string) {
    // Buscar admin en BD
    const admin = await this.prisma.admin.findUnique({
      where: { usuario },
    });

    if (!admin) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Validar password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar JWT
    const payload = { sub: admin.id, usuario: admin.usuario };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      admin: {
        id: admin.id,
        usuario: admin.usuario,
        nombre: admin.nombre,
      },
    };
  }

  /**
   * Valida el JWT
   */
  async validateAdmin(id: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { id },
    });

    if (!admin) {
      throw new UnauthorizedException('Admin no encontrado');
    }

    return admin;
  }
}
