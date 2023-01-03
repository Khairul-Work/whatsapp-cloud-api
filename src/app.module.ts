import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PusherService } from './pusher/pusher.service';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [WebhookModule],
  controllers: [AppController],
  providers: [PusherService],
})
export class AppModule {}
