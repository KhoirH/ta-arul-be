import {
  Controller,
  Get,
  Header,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { HistoryService } from './history.service';
import * as XLSX from 'xlsx';

@UseGuards(AuthGuard)
@Controller('history')
export class HistoryController {
  constructor(private historyService: HistoryService) {}

  @Get()
  async getAll() {
    const data = await this.historyService.getAll();
    return {
      data: data,
      message: 'Success',
      statusCode: 200,
    };
  }

  @Get('download')
  @Header('Content-Disposition', 'attachment; filename="history_data.xlsx"')
  @Header('X-Filename', 'history_data.xlsx')
  @Header('Access-Control-Expose-Headers', 'X-Filename')
  async getAllXlsx() {
    const data: any = await this.historyService.getAll();

    const ws = XLSX.utils.aoa_to_sheet([
      [
        'Nama Device',
        'Nomer Asset',
        'Serial Number',
        'Tahun Asset',
        'Status Asset',
        'Status Unit',
        'Divisi',
        'Name PIC',
        'Noreg PIC',
        'Departement',
        'Line',
        'Condition',
        'Tanggal Transaksi',
      ],
      ...(data ?? []).map((d) => [
        d.device_name,
        d.asset_number,
        d.serial_number,
        d.asset_year,
        d.reason,
        d.location,
        d.status_unit,
        d.division,
        d.pic_name,
        d.no_reg,
        d.dapartement,
        d.line,
        d.condition ? 'Baik' : 'Rusak',
        d.created_at,
      ]),
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    /* generate buffer */
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    /* Return a streamable file */
    return new StreamableFile(buf);
  }
}
