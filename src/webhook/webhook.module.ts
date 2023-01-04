import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports:[ConfigModule, HttpModule],
  controllers: [WebhookController],
})
export class WebhookModule {}
