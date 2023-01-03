import { Controller, Post, Body, Req, Get } from '@nestjs/common';
import { get } from 'http';

@Controller('webhook')
export class WebhookController {
  @Post()
  async handleWebhook(@Body() message: any) {
    console.log(message);
    // handle incoming message here
  }

  @Get()
  async handleWebhookGet(@Req() request: any) {
    console.log(request);
  }
}
