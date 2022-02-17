import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async signIn(email: string): Promise<{ accessToken: string }> {
    const payload = { email };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async getUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.findUnique({
      where: { email: data.email },
    });
  }
}
