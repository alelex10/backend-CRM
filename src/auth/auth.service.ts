import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterRequestDto } from './dtos/register-request.dto';
import { RegisterResponseDto } from './dtos/register-response.dto';
import { Role } from '../../generated/prisma';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  SALT_ROUNDS = 10;
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.SALT_ROUNDS = parseInt(this.configService.get('SALT_ROUNDS')!);
  }
  
  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findByEmail(email);
    console.log(user);
    if (!user) {
      throw new NotFoundException();
    }

    if (!(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.id,
      username: user.username,
      roles: user.roles,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  async register(
    registerDto: RegisterRequestDto,
  ): Promise<{ user: RegisterResponseDto; access_token: string }> {
    if (
      !this.comparePassword(registerDto.password, registerDto.confirmPassword)
    ) {
      throw new BadRequestException("Passwords don't match");
    }

    registerDto.password = bcrypt.hashSync(
      registerDto.password,
      this.SALT_ROUNDS,
    );

    const user = await this.usersService.create({
      username: registerDto.username,
      email: registerDto.email,
      password: registerDto.password,
      roles: [Role.USER],
    });

    const payload = {
      sub: user.id,
      username: user.username,
      roles: user.roles,
    };
    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: user.roles,
      },
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  comparePassword(password: string, repeatPassword: string): boolean {
    if (password === repeatPassword) {
      return true;
    } else {
      return false;
    }
  }
}
