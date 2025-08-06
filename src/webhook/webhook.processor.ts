import { Processor, Process } from '@nestjs/bull';
import type { Job } from 'bull';
import { LlmService } from '../llm/llm.service';
import { Logger } from '@nestjs/common';

@Processor('llm-queue')
export class WebhookProcessor {
  private readonly logger = new Logger(WebhookProcessor.name);
  constructor(private readonly llmService: LlmService) {}

  @Process('process-llm')
  async handleProcessLlm(job: Job) {
    const { message, callback_url } = job.data;
    this.logger.log(`Processing job ${job.id} for callback URL: ${callback_url}`);

    try {
      const llmResponse = await this.llmService.generateResponse(message);
      await this.llmService.sendResultToCallback(callback_url, llmResponse);
    } catch (error) {
      this.logger.error(`Job ${job.id} failed: ${error.message}`);
    }
  }
}


