import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    const skipPrismaConnect = process.env.SKIP_PRISMA_CONNECT === 'true';
    if (skipPrismaConnect) {
      return;
    }
    await this.$connect();
  }

  async onModuleDestroy() {
    const skipPrismaConnect = process.env.SKIP_PRISMA_CONNECT === 'true';
    if (skipPrismaConnect) {
      return;
    }
    await this.$disconnect();
  }
}
