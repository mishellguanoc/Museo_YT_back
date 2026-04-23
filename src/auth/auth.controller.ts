import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/login
   * Login del administrador
   * Body: { usuario: string, password: string }
   */
  @Post('login')
  async login(@Body() loginDto: { usuario: string; password: string }) {
    const { usuario, password } = loginDto;

    if (!usuario || !password) {
      throw new BadRequestException('Usuario y password son requeridos');
    }

    return this.authService.login(usuario, password);
  }
}
