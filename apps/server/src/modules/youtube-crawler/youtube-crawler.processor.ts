import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { FetchVideosJobData } from './types';
import { YoutubeCrawlerService } from './youtube-crawler.service';

@Processor('youtube-crawler', {
  concurrency: 1,
})
export class YoutubeCrawlerProcessor extends WorkerHost {
  private readonly logger = new Logger(YoutubeCrawlerProcessor.name);

  constructor(private youtubeCrawlerService: YoutubeCrawlerService) {
    super();
  }

  async process(job: Job) {
    const jobName = job.name;
    switch (jobName) {
      case 'fetch-videos':
        await this.youtubeCrawlerService.processVideosFetch();
        break;
      case 'process-channel-videos':
        const { channelId, channelName, youtubeId } = (
          job as FetchVideosJobData
        ).data;
        await this.youtubeCrawlerService.processChannelVideos(
          channelId,
          channelName,
          youtubeId,
        );
        break;
      default:
        this.logger.warn(`Unknown job name: ${jobName}`);
    }
  }
}
