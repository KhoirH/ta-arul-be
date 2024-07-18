import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('search')
  async findUsers(@Query() queryString: { name?: string; no_reg?: string }) {
    const data = await this.usersService.searchUsers(
      queryString.name,
      queryString.no_reg,
    );
    return {
      data: data,
      message: 'Success',
      statusCode: 200,
    };
  }
}
