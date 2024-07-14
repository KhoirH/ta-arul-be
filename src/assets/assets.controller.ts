import { Controller, Get, Query } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Controller('assets')
export class AssetsController {
  @Get()
  async testing(@Query('name') name: string) {
    const password = name;
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    const isMatch = await bcrypt.compare(
      password,
      '$2b$10$hnJJ0CtJyA6hugaUtg4nhOkPyQPS.BhDjoGAullVN3tOXfd/b8n82',
    );
    return {
      hash,
      salt,
      isMatch,
    };
  }
}
