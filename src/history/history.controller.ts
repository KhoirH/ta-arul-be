import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { HistoryService } from './history.service';

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
}
