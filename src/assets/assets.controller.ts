import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Post,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AssetsService } from './assets.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { HistoryService } from 'src/history/history.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';

@Controller('assets')
@UseGuards(AuthGuard)
export class AssetsController {
  constructor(
    private assetsService: AssetsService,
    private historyService: HistoryService,
  ) {}

  @Get()
  async getAll() {
    const data = await this.assetsService.getAllJoinHistory();
    return {
      data,
      message: 'Success',
      statusCode: 200,
    };
  }

  @Get('download')
  @Header('Content-Disposition', 'attachment; filename="asset_data.xlsx"')
  @Header('X-Filename', 'asset_data.xlsx')
  @Header('Access-Control-Expose-Headers', 'X-Filename')
  async getAllXlsx() {
    const data: any = await this.assetsService.getAllJoinHistory();

    const ws = XLSX.utils.aoa_to_sheet([
      [
        'Id Asset',
        'Nama Device',
        'Asset Number',
        'Serial Number',
        'Tahun Asset',
        'Lokasi',
        'Status',
      ],
      ...(data ?? []).map((d) => [
        d.id,
        d.device_name,
        d.asset_number,
        d.serial_number,
        d.asset_year,
        d.location,
        d.reason,
      ]),
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    /* generate buffer */
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    /* Return a streamable file */
    return new StreamableFile(buf);
  }

  @Post('upload-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data_sheet = XLSX.utils.sheet_to_json(worksheet);

    const data_database = data_sheet.map((d) => ({
      asset_number: d['Nomor Asset'],
      device_name: d['Jenis Asset'],
      serial_number: d?.['Nomor Serial'] ? `${d['Nomor Serial']}` : '-',
      asset_year: `${d['Tahun Pembelian']}`,
      location: d['Lokasi Kota'],
    }));

    const post = await this.assetsService.createAssets(data_database);
    return {
      data: post,
      message: 'Success',
      statusCode: 200,
    };
    // file is the uploaded file
  }

  @Get('count-by-reason')
  async getCountByReason() {
    const dataQuery: any = await this.assetsService.getCountByHistory();
    const data: any = {};
    // console.log(dataQuery)
    dataQuery.forEach((d) => {
      data[d.reason] = Number(d.count);
    });
    return {
      data,
      message: 'Success',
      statusCode: 200,
    };
  }

  @Get(':id')
  async getFirst(@Param('id', ParseIntPipe) id: number) {
    const data = await this.assetsService.getOneJoinHistory(id);
    return {
      data,
      message: 'Success',
      statusCode: 200,
    };
  }

  @Post('create')
  async createAsset(
    @Body()
    body: {
      asset_number: number;
      device_name: string;
      location: string;
      serial_number: string;
      asset_year: string;
    },
  ) {
    try {
      const post = await this.assetsService.createAsset({
        asset_number: body.asset_number,
        device_name: body.device_name,
        serial_number: body.serial_number,
        asset_year: body.asset_year,
        avability: true,
        location: body.location,
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

  @Post('update/:id')
  async updateAsset(
    @Body()
    body: {
      asset_number: number;
      device_name: string;
      serial_number: string;
      location: string;
      asset_year: string;
    },
    @Param('id') id: string,
  ) {
    try {
      const post = await this.assetsService.updateAsset(Number(id), {
        asset_number: body.asset_number,
        device_name: body.device_name,
        serial_number: body.serial_number,
        asset_year: body.asset_year,
        location: body.location,
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

  @Post('loan')
  async loanAsset(
    @Body()
    body: {
      id_asset: number;
      id_employee: number;
      status_unit: string;
      section: string;
      dapartement: string;
      line: string;
      division: string;
    },
  ) {
    try {
      const assetStatus = await this.assetsService.getById(body.id_asset);
      if (!assetStatus) {
        throw new BadRequestException('Asset tidak ditemukan');
      }

      if (!assetStatus?.avability) {
        throw new BadRequestException(`Asset tidak tersedia !`);
      }

      const assets = await this.assetsService.updateAsset(body.id_asset, {
        avability: false,
        version: assetStatus.version,
      });

      if (assetStatus.avability != assets.avability) {
        const history = await this.historyService.createHistory({
          condition: true,
          dapartement: body.dapartement,
          id_asset: body.id_asset,
          id_employee: body.id_employee,
          division: body.division,
          line: body.line,
          reason: 'dipinjam',
          section: body.section,
          status_unit: body.status_unit,
        });

        return {
          data: {
            assets,
            history,
          },
          message: 'Success',
          statusCode: 200,
        };
      }

      throw new BadRequestException(`Asset tidak tersedia !`);
    } catch (e) {
      if (e?.meta?.cause) {
        throw new BadRequestException(e?.meta?.cause);
      }
      throw e;
    }
  }

  @Post('revert')
  async revertAsset(
    @Body()
    body: {
      id_asset: number;
      id_employee: number;
      condition: string;
      reason: string;
      status_unit: string;
      section: string;
      dapartement: string;
      division: string;
      line: string;
    },
  ) {
    try {
      const assetStatus = await this.assetsService.getById(body.id_asset);
      if (!assetStatus) {
        throw new BadRequestException('Asset tidak ditemukan');
      }

      let avability = false;
      let condition = false;

      if (body.condition === 'baik') {
        avability = true;
        condition = true;
      }

      const assets = await this.assetsService.updateAsset(body.id_asset, {
        avability,
        version: assetStatus.version,
      });

      const history = await this.historyService.createHistory({
        condition,
        dapartement: body.dapartement,
        id_asset: body.id_asset,
        id_employee: body.id_employee,
        line: body.line,
        division: body.division,
        reason: body?.reason ?? 'on hand',
        section: body.section,
        status_unit: body.status_unit,
      });

      return {
        data: {
          assets,
          history,
        },
        message: 'Success',
        statusCode: 200,
      };
    } catch (e) {
      if (e?.meta?.cause) {
        throw new BadRequestException(e?.meta?.cause);
      }
      throw e;
    }
  }

  @Post('reason-changes')
  async reasonChanges(
    @Body()
    body: {
      id_asset: number;
      condition: string;
      reason: string;
    },
  ) {
    try {
      const historyStatus: any = await this.historyService.getLashInput(
        body.id_asset,
      );

      if (!historyStatus || historyStatus?.length === 0) {
        throw new BadRequestException('Asset tidak ditemukan dalam history');
      }

      let avability = false;
      let condition = false;

      if (body.condition === 'baik') {
        avability = true;
        condition = true;
      }

      const assets = await this.assetsService.updateAsset(body.id_asset, {
        avability,
        version: historyStatus[0]?.asset_version,
      });

      const history = await this.historyService.createHistory({
        condition,
        dapartement: historyStatus[0].dapartement,
        id_asset: body.id_asset,
        division: historyStatus[0].division,
        id_employee: historyStatus[0].id_employee,
        line: historyStatus[0].line,
        reason: body.reason,
        section: historyStatus[0].section,
        status_unit: historyStatus[0].status_unit,
      });

      return {
        data: {
          assets,
          history,
        },
        message: 'Success',
        statusCode: 200,
      };
    } catch (e) {
      if (e?.meta?.cause) {
        throw new BadRequestException(e?.meta?.cause);
      }
      throw e;
    }
  }

  @Post('delete/:id')
  async deleteAsset(@Param('id') id: string) {
    try {
      const post = await this.assetsService.deleteAsset(Number(id));
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
