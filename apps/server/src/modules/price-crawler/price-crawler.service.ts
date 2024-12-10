import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';
import { MoralisService } from '../../services/moralis.service';
import { PrismaService } from '../../services/prisma.service';
import { QUEUES } from '../../constants/queues';

@Injectable()
export class PriceCrawlerService implements OnModuleInit {
  constructor(
    @InjectQueue(QUEUES.PRICE_CRAWLER) private readonly queue: Queue,
    private prisma: PrismaService,
    private moralisService: MoralisService,
  ) {}

  async onModuleInit() {
    // clean current delay
    await this.queue.clean(0, 100000, 'delayed');

    // Add recurring job every 10 seconds
    await this.queue.add(
      'fetch-prices',
      {},
      {
        repeatJobKey: 'fetch-prices',
        repeat: {
          pattern: '0 */1 * * *', // every 1 hour
        },
        removeOnComplete: {
          count: 100,
          age: 1000 * 60 * 60 * 24, // 1 day
        },
        removeOnFail: {
          count: 100,
          age: 1000 * 60 * 60 * 24, // 1 day
        },
        backoff: {
          type: 'exponential',
          delay: 10000, // 10 seconds after failure, 20 seconds after success
        },
        attempts: 0,
      },
    );
  }

  async processPriceFetch() {
    try {
      // Get all tokens from database
      const tokens = await this.prisma.token.findMany();

      // Process each token
      for (const token of tokens) {
        // Here you would call Moralis API to get the price
        // This is a placeholder - implement actual Moralis API call
        const price = await this.moralisService.getTokenPriceInUsd(
          token.address,
        );

        // Save price to database
        await this.prisma.priceLog.create({
          data: {
            price,
            token: {
              connect: {
                id: token.id,
              },
            },
          },
        });
      }
    } catch (error) {
      console.error('Error processing price fetch:', error);
      throw error;
    }
  }
}
