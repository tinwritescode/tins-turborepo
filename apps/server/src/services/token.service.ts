import { Injectable } from '@nestjs/common';
import type { Prisma, Token } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Injectable()
export class TokenService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.TokenCreateInput): Promise<Token> {
    return this.prisma.token.create({ data });
  }

  async findAll(): Promise<Token[]> {
    return this.prisma.token.findMany();
  }

  async findOne(id: string): Promise<Token | null> {
    return this.prisma.token.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: Prisma.TokenUpdateInput): Promise<Token> {
    return this.prisma.token.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Token> {
    return this.prisma.token.delete({
      where: { id },
    });
  }
}
