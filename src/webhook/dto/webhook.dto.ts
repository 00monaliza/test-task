import { IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WebhookDto {
  @ApiProperty({ example: 'Hello, what is NestJS?', description: 'Text message for LLM' })
  @IsString()
  message: string;

  @ApiProperty({ example: 'https://example.com/callback', description: 'Callback URL to send the response' })
  @IsUrl()
  callback_url: string;
}