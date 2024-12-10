import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';
import { QUEUES } from '../../constants/queues';
import { PrismaService } from '../../services/prisma.service';
import { YouTubeService } from '../../services/youtube.service';

@Injectable()
export class YoutubeCrawlerService implements OnModuleInit {
  private readonly logger = new Logger(YoutubeCrawlerService.name);

  constructor(
    @InjectQueue(QUEUES.YOUTUBE_CRAWLER) private readonly queue: Queue,
    private prisma: PrismaService,
    private youtubeService: YouTubeService,
  ) {}

  async onModuleInit() {
    // clean current delay
    await this.queue.clean(0, 100000, 'delayed');

    // Add recurring job every hour
    await this.queue.add(
      'fetch-videos',
      {},
      {
        repeatJobKey: 'fetch-videos',
        repeat: {
          pattern: '0 * * * *', // Every hour
        },
        removeOnComplete: {
          count: 100,
          age: 1000 * 60 * 60 * 24, // 1 day
        },
        removeOnFail: {
          count: 100,
          age: 1000 * 60 * 60 * 24, // 1 day
        },
      },
    );
  }

  async processVideosFetch() {
    try {
      const channels = await this.prisma.channel.findMany();

      for (const channel of channels) {
        this.logger.log(`Fetching videos for channel: ${channel.name}`);

        const videos = await this.youtubeService.getLatestVideos(
          channel.youtubeId,
        );

        for (const video of videos) {
          if (!video.youtubeId) continue;

          this.logger.log(`Found video: ${video.title}`);

          await this.prisma.video.upsert({
            where: { youtubeId: video.youtubeId },
            create: {
              youtubeId: video.youtubeId,
              title: video.title,
              description: video.description,
              publishedAt: new Date(video.publishedAt),
              channel: { connect: { id: channel.id } },
            },
            update: {
              title: video.title,
              description: video.description,
            },
          });
        }
      }
    } catch (error) {
      this.logger.error('Error processing video fetch:', error);
      throw error;
    }
  }
}
