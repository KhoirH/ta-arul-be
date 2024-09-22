import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { PrismaService } from 'src/libs/services/prisma.service';

@Module({
  controllers: [EmployeeController],
  providers: [PrismaService, EmployeeService],
})
export class EmployeeModule {}
