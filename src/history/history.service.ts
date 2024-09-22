import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/libs/services/prisma.service';

@Injectable()
export class HistoryService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma
      .$queryRaw`Select History.id as id, Employee.name as pic_name, Employee.no_reg, Assets.device_name, Assets.asset_number, Assets.serial_number, Assets.asset_year, Assets.avability, History.condition, Assets.avability, History.status_unit, History.division, History.section, History.dapartement, History.line, History.reason from History left join Employee on History.id_employee = Employee.id left join Assets on History.id_asset = Assets.id`;
  }

  async createHistory(data: Prisma.HistoryCreateInput) {
    return this.prisma.history.create({
      data,
    });
  }

  async getLashInput(id_asset: number) {
    return this.prisma
      .$queryRaw`Select History.id as id, Employee.name as pic_name, Employee.no_reg, Assets.version as asset_version, Assets.device_name, Assets.asset_number, Assets.serial_number, Assets.asset_year, Assets.avability, History.condition, Assets.avability, History.status_unit, History.division, History.section, History.dapartement, History.line, History.reason from History left join Employee on History.id_employee = Employee.id left join Assets on History.id_asset = Assets.id where History.id_asset= ${id_asset} order by History.id desc limit 1 `;
  }
}
