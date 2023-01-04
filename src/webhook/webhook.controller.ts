import { HttpService } from '@nestjs/axios';
import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist';
import { Request, Response } from 'express';
import { map } from 'rxjs';

@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {}
  token = this.config.get('TOKEN');

  @Post()
  async handleWebhook(@Req() request: Request, @Res() response: Response) {
    const params = request.body;
    console.log(JSON.stringify(params, null, 2));
    // handle incoming message here
    if (params.object) {
      if (
        params.entry &&
        params.entry[0].changes &&
        params.entry[0].changes[0].value.message &&
        params.entry[0].changes[0].value.message[0]
      ) {
        const phone_no_id =
          params.entry[0].changes[0].value.metadata.phone_number_id;
        const from = params.entry[0].changes[0].value.messages[0].from;

        const data = {
          messaging_product: 'whatsapp',
          to: from,
          text: { body: 'Hi.. saya khairul' },
          // type: 'template',
          // template: { name: 'hello_world', language: { code: 'en_US' } },
        };
        const requestConfig: any = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
          },
        };
        try {
          this.httpService
            .post(
              `https://graph.facebook.com/v15.0/${phone_no_id}/messages`,
              data,
              requestConfig,
            )
            .pipe(
              map((response) => {
                return response.data;
              }),
            );
        } catch (error) {
          console.log(error);
        }

        response.status(200);
      } else {
        response.status(404);
      }
    }
  }

  @Post('send-message')
  sendMessage() {
    const data = {
      messaging_product: 'whatsapp',
      to: '60132696972',
      text: { body: 'Hi.. saya khairul' },
      // type: 'template',
      // template: { name: 'hello_world', language: { code: 'en_US' } },
    };
    const requestConfig: any = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
    };
    try {
      const resp = this.httpService
        .post(
          'https://graph.facebook.com/v15.0/112789665023600/messages',
          data,
          requestConfig,
        )
        .pipe(
          map((response) => {
            return response.data;
          }),
        );
      console.log('masuk sini 2');
      return resp;
    } catch (error) {
      console.log('masuk sini 3');

      console.log(error);
    }
  }

  // verify callback url from the cloud api
  @Get()
  async handleWebhookGet(@Req() request: Request, @Res() res: Response) {
    console.log(request.query);
    const mode = request.query['hub.mode'];
    const challenge = request.query['hub.challenge'];
    const token = request.query['hub.verify_token'];

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
