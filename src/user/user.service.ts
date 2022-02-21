import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  findOne(data: Prisma.UserUncheckedCreateInput): Promise<User> {
    return this.prisma.user.findUnique({ where: { id: data.id } });
  }
}
