import { Module } from '@nestjs/common';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';
import { PrismaService } from 'src/libs/services/prisma.service';
import { HistoryService } from 'src/history/history.service';

@Module({
  controllers: [AssetsController],
  providers: [PrismaService, AssetsService, HistoryService],
})
export class AssetsModule {}
