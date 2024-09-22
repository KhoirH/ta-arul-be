import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/libs/services/prisma.service';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  async createEmployees(
    data: Prisma.EmployeeCreateInput[],
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.employee.createMany({
      data,
    });
  }

  async createEmployee(data: Prisma.EmployeeCreateInput) {
    return this.prisma.employee.create({
      data,
    });
  }

  async updateEmployee(id: number, data: Prisma.EmployeeUpdateInput) {
    return this.prisma.employee.update({
      data: data,
      where: {
        id,
      },
    });
  }

  async deleteEmployee(id: number) {
    return this.prisma.employee.delete({
      where: {
        id,
      },
    });
  }

  async getAll() {
    return this.prisma.employee.findMany();
  }

  async getOne(id: number) {
    return this.prisma.employee.findFirst({
      where: {
        id,
      },
    });
  }

  async searchEmployee(name?: string, no_reg?: string) {
    const nameConvert = name ? `%${name}%` : '0';
    const noRegConvert = no_reg ? `%${no_reg}%` : '0';
    return this.prisma
      .$queryRaw`select * from Employee where name LIKE ${nameConvert} OR no_reg LIKE ${noRegConvert}`;
  }
}
