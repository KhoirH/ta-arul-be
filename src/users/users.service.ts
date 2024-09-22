import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/libs/services/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOneByUsername(username) {
    return this.prisma.users.findFirst({
      where: {
        username,
      },
    });
  }
}
