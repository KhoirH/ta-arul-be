import { Injectable } from '@nestjs/common';
import { Assets, Prisma } from '@prisma/client';
import { PrismaService } from 'src/libs/services/prisma.service';

@Injectable()
export class AssetsService {
  constructor(private prisma: PrismaService) {}

  async getAllJoinHistory() {
    return this.prisma.$queryRaw`
        select 
          Selection_History.condition,
          Selection_History.created_at,
          (case when Selection_History.reason IS NULL  then 'tersedia'
            when Selection_History.reason in ("on hand")  then 'tersedia' 
            else Selection_History.reason end
          ) as reason,
          Assets.id,
          Assets.device_name,
          Assets.location,
          Assets.serial_number,
          Assets.avability,
          Assets.asset_year
        from Assets 
        left join 
          (select History.condition, History.created_at, History.reason, History.id_asset from History order by History.id desc limit 1 ) as Selection_History 
          on Assets.id = Selection_History.id_asset
      `;
  }

  async getCountByHistory() {
    return this.prisma.$queryRaw`
      select count(
        case when Selection_History.reason IS NULL  then 'tersedia'
            when Selection_History.reason in ("on hand")  then 'tersedia' 
            else Selection_History.reason end
        ) as count, 
        (
        case when Selection_History.reason IS NULL  then 'tersedia'
            when Selection_History.reason in ("on hand")  then 'tersedia' 
            else Selection_History.reason end
        ) as reason
        from Assets 
        left join (select History.condition, History.created_at, History.reason, History.id_asset from History order by History.id desc limit 1 ) as Selection_History 
        on Assets.id = Selection_History.id_asset 
        group by (
        case when Selection_History.reason IS NULL  then 'tersedia'
            when Selection_History.reason in ("on hand")  then 'tersedia' 
            else Selection_History.reason end
        )
    `;
  }

  async getOneJoinHistory(id: number) {
    const data = await this.prisma
      .$queryRaw`select * from Assets left join (select History.condition, History.created_at, History.reason, History.id_asset from History order by History.id desc limit 1 ) as Selection_History on Assets.id = Selection_History.id_asset where Assets.id=${id}`;
    if (!data) {
      throw new Error('Error');
    }
    return data[0];
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

  async createAssets(
    data: Prisma.AssetsCreateInput[],
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.assets.createMany({
      data,
    });
  }

  async deleteAsset(id: number) {
    return this.prisma.assets.delete({ where: { id } });
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
