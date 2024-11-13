import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.loginAdmin(
        loginDto.email,
        loginDto.password,
      );
    } catch (error) {
      throw new UnauthorizedException('Invalid admin credentials');
    }
  }
}
