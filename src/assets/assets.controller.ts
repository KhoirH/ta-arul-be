import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AssetsService } from './assets.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { HistoryService } from 'src/history/history.service';

@Controller('assets')
@UseGuards(AuthGuard)
export class AssetsController {
  constructor(
    private assetsService: AssetsService,
    private historyService: HistoryService,
  ) {}

  @Get()
  async getAll() {
    const data = await this.assetsService.getAll();
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
      id_user: number;
      status_unit: string;
      section: string;
      dapartement: string;
      line: string;
    },
  ) {
    try {
      const assetStatus = await this.assetsService.getById(body.id_asset);

      if (!assetStatus) {
        throw new BadRequestException('Asset tidak ditemukan');
      }

      if (!assetStatus.avability) {
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
          id_user: body.id_user,
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
      id_user: number;
      condition: string;
      reason: string;
      status_unit: string;
      section: string;
      dapartement: string;
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
        id_user: body.id_user,
        line: body.line,
        reason: body.reason,
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
      id_user: number;
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
        id_user: body.id_user,
        line: historyStatus[0].line,
        reason: historyStatus[0].reason,
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
}
