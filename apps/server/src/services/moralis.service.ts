import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Moralis from 'moralis';

@Injectable()
export class MoralisService implements OnModuleInit {
  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    await Moralis.start({
      apiKey: this.configService.get<string>('MORALIS_API_KEY'),
      logLevel: 'debug',
    });
    console.log('Moralis has been started');
  }

  async getTokenPriceInUsd(address: string) {
    const token = await Moralis.EvmApi.token.getTokenPrice({
      address,
      chain: '0x1',
    });
    return token.result.usdPrice;
  }
}
