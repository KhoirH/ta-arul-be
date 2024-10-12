import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiBody({
    schema: {
      default: {
        password: 'admin',
        username: 'admin',
      },
    },
  })
  async signIn(@Body() signInDto: Record<string, any>) {
    try {
      if (!signInDto.username || !signInDto.password) {
        throw new BadRequestException();
      }
      const data = await this.authService.signIn(
        signInDto.username,
        signInDto.password,
      );
      return {
        data,
        statusCode: 200,
        message: 'Success',
      };
    } catch (e) {
      throw e;
    }
  }

  @UseGuards(AuthGuard)
  @Get('verify-token')
  verifyToken() {
    return {
      statucCode: 200,
      success: true,
    };
  }
}
