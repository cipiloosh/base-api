import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User, Prisma, Token } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { crypto } from '../utils';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async signIn(email: string, id: number): Promise<{ accessToken: string }> {
    const payload = { email, id };
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

  async createToken(data: Prisma.TokenCreateInput): Promise<Token> {
    return this.prisma.token.create({
      data,
    });
  }

  async getToken(): Promise<Token> {
    return this.prisma.token.findFirst();
  }

  async deleteToken(where: Prisma.TokenWhereUniqueInput): Promise<any> {
    return this.prisma.token.delete({
      where,
    });
  }

  async getJwtToken(
    data: Prisma.TokenWhereUniqueInput,
  ): Promise<string | null> {
    const tokenExists = await this.prisma.token.findUnique({
      where: { token: data.token },
    });

    if (!tokenExists) {
      return null;
    }

    const jwt = crypto.decrypt(tokenExists.token);
    return jwt;
  }
}
