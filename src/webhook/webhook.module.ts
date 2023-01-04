import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { ConfigService } from '@nestjs/config/dist/config.service';

@Module({
  controllers: [WebhookController],
  providers: [ConfigService],
})
export class WebhookModule {}
