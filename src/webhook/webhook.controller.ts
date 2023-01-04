import { Controller, Post, Body, Req, Get, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config/dist';

@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {}
  @Post()
  async handleWebhook(@Req() request: Request, @Res() response: Response) {
    let params = request.body;
    let token = this.config.get('TOKEN');
    console.log(JSON.stringify(params, null, 2));
    // handle incoming message here
    if (params.object) {
      if (
        params.entry &&
        params.entry[0].changes &&
        params.entry[0].changes[0].value.message &&
        params.entry[0].changes[0].value.message[0]
      ) {
        let phone_no_id =
          params.entry[0].changes[0].value.metadata.phone_number_id;
        let from = params.entry[0].changes[0].value.messages[0].from;
        let msg_body = params.entry[0].changes[0].value.messages[0].text.body;

        let data = {
          messaging_product: 'whatsapp',
          to: from,
          text: { body: 'Hi.. saya khairul' },
        };
        const headersRequest = {
          'Content-Type': 'application/json',
          // 'Authorization': `Basic ${encodeToken}`,
        };
        this.httpService.post(
          'https://graph.facebook.com/v15.0/' +
            phone_no_id +
            '/messages?access_token=' +
            token,
          data,
          { headers: headersRequest },
        ).pipe;

        response.status(200);
      } else {
        response.status(404);
      }
    }
  }

  // verify callback url from the cloud api
  @Get()
  async handleWebhookGet(@Req() request: Request, @Res() res: Response) {
    console.log(request.query);
    let mode = request.query['hub.mode'];
    let challenge = request.query['hub.challenge'];
    let token = request.query['hub.verify_token'];

    const myToken = this.config.get('VERIFY_TOKEN');

    if (mode && token) {
      if (mode === 'subscribe' && token === myToken) {
        res.status(200).send(challenge);
      } else {
        res.status(403);
      }
    }
  }
}
