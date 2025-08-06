import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);
  private readonly openRouterApiKey: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    const apiKey = this.configService.get<string>('OPENROUTER_API_KEY');
    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY не определен');
    }
    this.openRouterApiKey = apiKey;
  }

  async generateResponse(message: string): Promise<any> {
    const apiUrl = 'https://openrouter.ai/api/v1/chat/completions';

    const headers = {
      'Authorization': `Bearer ${this.openRouterApiKey}`,
      'Content-Type': 'application/json',
    };

    const data = {
      model: 'mistralai/mistral-7b-instruct:free',    
      messages: [{ role: 'user', content: message }],
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(apiUrl, data, { headers }),
      );
      
      return response.data.choices[0].message.content; 

    } catch (error) {
      this.logger.error('Failed to get response from LLM', error.response?.data);
      throw new Error('Error communicating with LLM service');
    }
  }

  async sendResultToCallback(callbackUrl: string, llmResponse: any) {
    try {
      await firstValueFrom(this.httpService.post(callbackUrl, llmResponse));
      this.logger.log(`Successfully sent result to callback URL: ${callbackUrl}`);
    } catch (error) {
      this.logger.error(`Failed to send result to callback URL: ${callbackUrl}`, error.response?.data);
    }
  }
}