import { IsString, IsUrl, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WebhookDto {
  @ApiProperty({ example: 'Hello', description: 'Text message for LLM' })
  @IsString()
  message: string;

  @ApiProperty({ example: 'https://example.com/callback', description: 'Callback URL to send the response' })
  @IsUrl()
  callback_url: string;

  @ApiProperty({ 
    example: 'd9b3e0c0-6d4b-4a5f-9f3a-1b4e2d3c5a6b', 
    description: 'Optional conversation ID to maintain context',
    required: false,
  })
  @IsOptional()
  @IsString()
  conversationId?: string; 
}