import { Injectable } from '@nestjs/common';
import { Assets, Prisma } from '@prisma/client';
import { PrismaService } from 'src/libs/services/prisma.service';

@Injectable()
export class AssetsService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.assets.findMany();
  }

  async getById(id: number) {
    return this.prisma.assets.findFirst({
      where: {
        id,
      },
    });
  }

  async createAsset(data: Prisma.AssetsCreateInput): Promise<Assets> {
    return this.prisma.assets.create({
      data,
    });
  }

  async updateAsset(
    id: number,
    {
      version,
      ...data
    }: Omit<Prisma.AssetsUpdateInput, 'version'> &
      Pick<Prisma.AssetsCreateInput, 'version'>,
  ): Promise<Assets> {
    return this.prisma.assets.update({
      data: {
        ...data,
        version: {
          increment: 1,
        },
      },
      where: {
        id,
        version,
      },
    });
  }
}
