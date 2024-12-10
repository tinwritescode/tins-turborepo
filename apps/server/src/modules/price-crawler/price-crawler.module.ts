import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { QUEUES } from '../../constants/queues';
import { MoralisService } from '../../services/moralis.service';
import { PrismaService } from '../../services/prisma.service';
import { PriceCrawlerProcessor } from './price-crawler.processor';
import { PriceCrawlerService } from './price-crawler.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUES.PRICE_CRAWLER,
    }),
    BullBoardModule.forFeature({
      name: QUEUES.PRICE_CRAWLER,
      adapter: BullMQAdapter,
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
