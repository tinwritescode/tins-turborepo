import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';
import { QUEUES } from '../../constants/queues';
import { PrismaService } from '../../services/prisma.service';
import { YouTubeService } from '../../services/youtube.service';
import { YoutubeCrawlerQueue } from './types';

@Injectable()
export class YoutubeCrawlerService implements OnModuleInit {
  private readonly logger = new Logger(YoutubeCrawlerService.name);

  constructor(
    @InjectQueue(QUEUES.YOUTUBE_CRAWLER)
    private readonly queue: Queue,
    private prisma: PrismaService,
    private youtubeService: YouTubeService,
  ) {}

  async onModuleInit() {
    // clean current delay
    const repeatableJobs = await this.queue.getRepeatableJobs();

    // clean all repeatable jobs
    for (const job of repeatableJobs) {
      await this.queue.removeRepeatableByKey(job.key);
    }

    // Add recurring job every hour
    await this.queue.add(
      'fetch-videos',
      {},
      {
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

      // Add each channel's videos to the queue
      await Promise.all(
        channels.map(async (channel) => {
          this.logger.log(`Queueing video fetch for channel: ${channel.name}`);

          // Add a new job to the queue for each channel
          await (this.queue as YoutubeCrawlerQueue).add(
            'process-channel-videos',
            {
              channelId: channel.id,
              channelName: channel.name,
              youtubeId: channel.youtubeId,
            },
            {
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
        }),
      );
    } catch (error) {
      this.logger.error('Error queueing video fetch:', error);
      throw error;
    }
  }

  // Add this new method to process individual channel videos
  async processChannelVideos(
    channelId: string,
    channelName: string,
    youtubeId: string,
  ) {
    try {
      this.logger.log(`Fetching videos for channel: ${channelName}`);

      const videos = await this.youtubeService.getLatestVideos(youtubeId);

      await Promise.all(
        videos
          .filter((video) => video.youtubeId)
          .map(async (video) => {
            this.logger.log(`Found video: ${video.title}`);

            return this.prisma.video.upsert({
              where: { youtubeId: video.youtubeId },
              create: {
                youtubeId: video.youtubeId,
                title: video.title,
                description: video.description,
                publishedAt: new Date(video.publishedAt),
                channel: { connect: { id: channelId } },
              },
              update: {
                title: video.title,
                description: video.description,
              },
            });
          }),
      );
    } catch (error) {
      this.logger.error(
        `Error processing videos for channel ${channelName}:`,
        error,
      );
      throw error;
    }
  }
}
