import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AssetsModule } from './assets/assets.module';
import { HistoryModule } from './history/history.module';
import { EmployeeModule } from './employee/employee.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    AssetsModule,
    HistoryModule,
    EmployeeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
