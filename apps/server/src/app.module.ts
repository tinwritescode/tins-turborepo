import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokenService } from './services/token.service';
import { PriceCrawlerModule } from './modules/price-crawler/price-crawler.module';
import { PrismaService } from './services/prisma.service';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { YoutubeCrawlerModule } from './modules/youtube-crawler/youtube-crawler.module';

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
    BullBoardModule.forRoot({
      route: '/bull-board',
      adapter: ExpressAdapter,
    }),
    PriceCrawlerModule,
    YoutubeCrawlerModule,
  ],
  controllers: [AppController],
  providers: [AppService, TokenService, PrismaService],
})
export class AppModule {}
