import { Controller, Post, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { WebhookDto } from './dto/webhook.dto'; 

@Controller('webhook')
export class WebhookController {
    private readonly logger = new Logger(WebhookController.name);

    constructor(@InjectQueue('llm-queue') private readonly llmQueue: Queue) {}

    @Post()
    @HttpCode(HttpStatus.ACCEPTED)
    async handleWebhook(@Body() data: WebhookDto) { 
        this.logger.log(`Received message to process: ${data.message} for callback ${data.callback_url}`);

        await this.llmQueue.add('process-llm', {
            message: data.message,
            callback_url: data.callback_url,
        });

        return {
            status: 'accepted',
            message: 'мой зарос принят',
        };
    }
}