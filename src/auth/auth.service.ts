import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../modules/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateAdmin(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (
      user &&
      user.isAdmin &&
      (await bcrypt.compare(password, user.password))
    ) {
      return { userId: user.id, email: user.email, isAdmin: user.isAdmin };
    }
    throw new UnauthorizedException();
  }

  async loginAdmin(email: string, password: string) {
    const user = await this.validateAdmin(email, password);
    const payload = {
      email: user.email,
      sub: user.userId,
      isAdmin: user.isAdmin,
    };
    return { access_token: this.jwtService.sign(payload) };
  }
}
