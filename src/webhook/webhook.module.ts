import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config';

import { WebhookController } from './webhook.controller';
import { WebhookProcessor } from './webhook.processor';
import { LlmModule } from '../llm/llm.module'; 
import { LlmService } from '../llm/llm.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    BullModule.registerQueue({
      name: 'llm-queue',
    }),
    LlmModule, 
  ],
  controllers: [WebhookController],
  providers: [
    WebhookProcessor,
    LlmService 
  ],
})
export class WebhookModule {}