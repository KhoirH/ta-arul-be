import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Create cat' })
  @ApiBody({
    schema: {
      default: {
        password: 'admin',
        username: 'admin',
      },
    },
  })
  signIn(@Body() signInDto: Record<string, any>) {
    if (!signInDto.username || !signInDto.password) {
      throw new BadRequestException();
    }
    return this.authService.signIn(signInDto.username, signInDto.password);
  }
}
