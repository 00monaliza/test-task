import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { WebhookModule } from './webhook/webhook.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST') || 'localhost',
          port: parseInt(configService.get('REDIS_PORT') || '6379', 10),
        },
      }),
      inject: [ConfigService],
    }),
    WebhookModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}