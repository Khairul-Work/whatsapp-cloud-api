import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WebhookController } from './webhook.controller';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [WebhookController],
})
export class WebhookModule {}
