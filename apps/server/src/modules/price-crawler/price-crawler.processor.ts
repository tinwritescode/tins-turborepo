import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PriceCrawlerService } from './price-crawler.service';

@Processor('price-crawler', {
  concurrency: 1,
})
export class PriceCrawlerProcessor extends WorkerHost {
  log: Logger;
  constructor(private priceCrawlerService: PriceCrawlerService) {
    super();
    this.log = new Logger(PriceCrawlerProcessor.name);
  }

  async process(job: Job) {
    await this.priceCrawlerService.processPriceFetch();
    this.log.debug(`Price fetch completed for ${job.id}`);
    return {};
  }

  // @OnWorkerEvent('completed')
  // onCompleted(job: Job) {
  //   this.log.debug(`Price fetch completed for ${job.id}`);
  // }
}
