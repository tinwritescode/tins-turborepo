import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PriceCrawlerService } from '../services/price-crawler.service';
import { PriceCrawlerProcessor } from '../processors/price-crawler.processor';
import { PrismaService } from '../services/prisma.service';
import { MoralisService } from '../services/moralis.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'price-crawler',
    }),
    ConfigModule,
  ],
  providers: [
    PriceCrawlerService,
    PriceCrawlerProcessor,
    PrismaService,
    MoralisService,
  ],
  exports: [],
})
export class PriceCrawlerModule {}
