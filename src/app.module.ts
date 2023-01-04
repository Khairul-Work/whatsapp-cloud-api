import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PusherService } from './pusher/pusher.service';
import { WebhookModule } from './webhook/webhook.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [WebhookModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [PusherService],
})
export class AppModule {}
