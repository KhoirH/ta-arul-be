import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';
import * as XLSX from 'xlsx';
import { EmployeeService } from './employee.service';

@Controller('employee')
@UseGuards(AuthGuard)
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  @Post('upload-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data_sheet = XLSX.utils.sheet_to_json(worksheet);

    const data_database = data_sheet.map((d) => ({
      dapartement: d?.['Departement'] ?? '-',
      function: d['Jabatan'],
      line: d['Line'],
      no_reg: d['Nomor ID'],
      section: d['Section'],
      name: d['Nama'],
    }));

    const post = await this.employeeService.createEmployees(data_database);
    return {
      data: post,
      message: 'Success',
      statusCode: 200,
    };
    // // file is the uploaded file
  }

  @Get()
  async getAll() {
    const data = await this.employeeService.getAll();
    return {
      data,
      message: 'Success',
      statusCode: 200,
    };
  }

  @Get('search')
  async findUsers(@Query() queryString: { name?: string; no_reg?: string }) {
    const data = await this.employeeService.searchEmployee(
      queryString.name,
      queryString.no_reg,
    );
    return {
      data,
      message: 'Success',
      statusCode: 200,
    };
  }

  @Get(':id')
  async getFirst(@Param('id', ParseIntPipe) id: number) {
    const data = await this.employeeService.getOne(id);
    return {
      data,
      message: 'Success',
      statusCode: 200,
    };
  }

  @Post('update/:id')
  async updateEmployee(
    @Body()
    body: {
      dapartement: string;
      function: string;
      name: string;
      no_reg: string;
      section: string;
    },
    @Param('id') id: string,
  ) {
    try {
      const post = await this.employeeService.updateEmployee(Number(id), {
        dapartement: body.dapartement,
        function: body.function,
        line: body.function,
        name: body.name,
        no_reg: body.no_reg,
        section: body.section,
      });
      return {
        data: post,
        message: 'Success',
        statusCode: 200,
      };
    } catch (e) {
      throw new BadRequestException(e?.meta?.cause);
    }
  }

  @Post('delete/:id')
  async deleteEmployee(@Param('id') id: string) {
    try {
      const post = await this.employeeService.deleteEmployee(Number(id));
      return {
        data: post,
        message: 'Success',
        statusCode: 200,
      };
    } catch (e) {
      throw new BadRequestException(e?.meta?.cause);
    }
  }

  @Post('create')
  async createAsset(
    @Body()
    body: {
      dapartement: string;
      function: string;
      name: string;
      no_reg: string;
      section: string;
    },
  ) {
    try {
      const post = await this.employeeService.createEmployee({
        dapartement: body.dapartement,
        function: body.function,
        line: body.function,
        name: body.name,
        no_reg: body.no_reg,
        section: body.section,
      });
      return {
        data: post,
        message: 'Success',
        statusCode: 200,
      };
    } catch (e) {
      throw new BadRequestException(e?.meta?.cause);
    }
  }
}
