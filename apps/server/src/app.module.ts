import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokenService } from './services/token.service';
import { PriceCrawlerModule } from './modules/price-crawler.module';
import { PrismaService } from './services/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: false,
      },
    }),
    PriceCrawlerModule,
  ],
  controllers: [AppController],
  providers: [AppService, TokenService, PrismaService],
})
export class AppModule {}
