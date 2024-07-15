import { Injectable } from '@nestjs/common';
import { Assets, Prisma } from '@prisma/client';
import { PrismaService } from 'src/libs/services/prisma.service';

@Injectable()
export class AssetsService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.assets.findMany();
  }

  async createAsset(data: Prisma.AssetsCreateInput): Promise<Assets> {
    return this.prisma.assets.create({
      data,
    });
  }

  async updateAsset(
    id: number,
    data: Prisma.AssetsCreateInput,
  ): Promise<Assets> {
    return this.prisma.assets.update({
      data,
      where: {
        id,
      },
    });
  }
}
