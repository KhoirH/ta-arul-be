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

@Controller('assets')
@UseGuards(AuthGuard)
export class AssetsController {
  constructor(private assetsService: AssetsService) {}

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
}
