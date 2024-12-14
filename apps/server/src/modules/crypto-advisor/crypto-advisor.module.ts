import { Module } from '@nestjs/common';
import { CryptoAdvisorService } from './crypto-advisor.service';

@Module({
  imports: [],
  providers: [CryptoAdvisorService],
  controllers: [],
})
export class CryptoAdvisorModule {}
