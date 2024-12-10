import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
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
    await this.youtubeCrawlerService.processVideosFetch();
    this.logger.log(`Video fetch completed for job ${job.id}`);
    return {};
  }
}
