import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AssetsModule } from './assets/assets.module';
import { HistoryModule } from './history/history.module';

@Module({
  imports: [AuthModule, UsersModule, AssetsModule, HistoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
