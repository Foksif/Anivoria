import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { hashSync, genSaltSync } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  save(user: Partial<User>) {
    const hashedPassword = this.hashPassword(user.password);
    return this.prisma.user.create({
      data: {
        email: user.email,
        password: hashedPassword,
        roles: ['USER'],
      },
    });
  }

  findOne(idOrEmail: string) {
    return this.prisma.user.findFirst({
      where: {
        OR: [{ id: idOrEmail }, { email: idOrEmail }],
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  delete(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  private hashPassword(password: string) {
    return hashSync(password, genSaltSync(10));
  }
}
