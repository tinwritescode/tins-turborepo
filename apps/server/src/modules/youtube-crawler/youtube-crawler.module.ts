import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule } from '@nestjs/config';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { QUEUES } from '../../constants/queues';
import { YoutubeCrawlerService } from './youtube-crawler.service';
import { YoutubeCrawlerProcessor } from './youtube-crawler.processor';
import { PrismaService } from '../../services/prisma.service';
import { YouTubeService } from '../../services/youtube.service';
import { ChannelController } from '../youtube/channel.controller';
import { VideoController } from '../youtube/video.controller';

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
