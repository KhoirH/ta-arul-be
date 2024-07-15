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

  async searchUsers(name?: string, no_reg?: string) {
    const nameConvert = name ? `%${name}%` : '0';
    const noRegConvert = no_reg ? `%${no_reg}%` : '0';
    return this.prisma
      .$queryRaw`select no_reg, name from Users where name LIKE ${nameConvert} OR no_reg LIKE ${noRegConvert}`;
  }
}
