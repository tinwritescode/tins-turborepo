import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { QUEUES } from '../../constants/queues';
import { PrismaService } from '../../services/prisma.service';
import { YouTubeService } from '../../services/youtube.service';
import { ChannelController } from '../youtube/channel.controller';
import { VideoController } from '../youtube/video.controller';
import { YoutubeCrawlerProcessor } from './youtube-crawler.processor';
import { YoutubeCrawlerService } from './youtube-crawler.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUES.YOUTUBE_CRAWLER,
    }),
    BullBoardModule.forFeature({
      name: QUEUES.YOUTUBE_CRAWLER,
      adapter: BullMQAdapter,
    }),

    ConfigModule,
  ],
  controllers: [ChannelController, VideoController],
  providers: [
    YoutubeCrawlerService,
    YoutubeCrawlerProcessor,
    PrismaService,
    YouTubeService,
  ],
})
export class YoutubeCrawlerModule {}
