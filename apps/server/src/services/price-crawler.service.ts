import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from './prisma.service';
import { MoralisService } from './moralis.service';

@Injectable()
export class PriceCrawlerService implements OnModuleInit {
  constructor(
    @InjectQueue('price-crawler') private readonly queue: Queue,
    private prisma: PrismaService,
    private moralisService: MoralisService,
  ) {}

  async onModuleInit() {
    // Add recurring job every 10 seconds
    await this.queue.add(
      'fetch-prices',
      {},
      {
        repeat: {
          every: 10000, // 10 seconds
        },
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
        const price = Math.random() * 1000; // Replace with actual Moralis API call

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
