import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PriceCrawlerService } from '../services/price-crawler.service';
import { Logger } from '@nestjs/common';

@Processor('price-crawler')
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

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.log.debug(`Price fetch completed for ${job.id}`);
  }
}
