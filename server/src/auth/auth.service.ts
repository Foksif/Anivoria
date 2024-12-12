import { Injectable } from '@nestjs/common';
import { RegisterDto, LoginDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from '../user/user.service';
import { Logger } from '@nestjs/common';
import { ITokens } from './interfaces';
import { UnauthorizedException } from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { Token } from '@prisma/client';
import { v4 } from 'uuid';
import { add } from 'date-fns';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async register(dto: RegisterDto) {
    return this.userService.save(dto).catch((err) => {
      this.logger.error(err);
      return null;
    });
  }

  async login(dto: LoginDto): Promise<ITokens> {
    const user: User = await this.userService
      .findOne(dto.email)
      .catch((err) => {
        this.logger.error(err);
        return null;
      });

    if (!user || !compareSync(dto.password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.jwtService.sign({
      id: user.id,
      email: user.email,
      roles: user.roles,
    });

    const refreshToken = await this.getRefreshToken(user.id);

    return { accessToken, refreshToken };
  }

  async getRefreshToken(userId: string): Promise<Token> {
    return this.prisma.token.create({
      data: {
        token: v4(),
        exp: add(new Date(), { days: 30 }),
        userId,
      },
    });
  }
}
