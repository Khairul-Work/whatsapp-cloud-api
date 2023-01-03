import { Body, Controller, Get, Post } from '@nestjs/common';
import { PusherService } from './pusher/pusher.service';

@Controller('api')
export class AppController {
  constructor(private readonly pusherService: PusherService) {}

  @Post('messages')
  async messages(@Body() req: { username: string; message: string }) {
    await this.pusherService.trigger('chat', 'messages', req);

    return [];
  }
}
