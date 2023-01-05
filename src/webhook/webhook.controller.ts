import { HttpService } from '@nestjs/axios';
import { Controller, Get, Post, Req, Res, HttpStatus } from '@nestjs/common';
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
  async handleWebhook(@Req() request: Request, @Res() res: Response) {
    const params = request.body;
    // handle incoming message here
    if (params.object) {
      if (
        params.entry &&
        params.entry[0].changes &&
        params.entry[0].changes[0].value.messages &&
        params.entry[0].changes[0].value.messages[0]
      ) {
        const phone_no_id =
          params.entry[0].changes[0].value.metadata.phone_number_id;
        const from = params.entry[0].changes[0].value.messages[0].from;
        const id = params.entry[0].changes[0].value.messages[0].id;
        const msg = params.entry[0].changes[0].value.messages[0].text.body;
        const name = params.entry[0].changes[0].value.contacts[0].profile.name;

        let reply = '';

        if (msg == 'hi') {
          reply = 'Hi, awak nak beli barang boek?? reply nak kalau nak.';
        } else if (msg == 'nak') {
          reply = 'Tkde pun barang tu, huhuhu. k bye';
        } else {
          const dataChatBot = {
            user_id: id,
            message: msg,
            from_name: name,
            to_name: 'Customer Support',
            situation: 'Customer asking for help',
            translate_from: 'auto',
            translate_to: 'auto',
          };
          const requestConfig: any = {
            headers: {
              'content-type': 'application/json',
              'X-RapidAPI-Key':
                '0bb1de8e02msh34cb401bfe95328p13898fjsnb450ab7c5409',
              'X-RapidAPI-Host': 'waifu.p.rapidapi.com',
            },
          };

          const resp = await this.httpService.axiosRef.post(
            'https://waifu.p.rapidapi.com/v1/waifu',
            dataChatBot,
            requestConfig,
          );

          reply = resp.data['response'];
        }

        const data = {
          messaging_product: 'whatsapp',
          to: from,
          text: { body: reply },
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
              `https://graph.facebook.com/v15.0/${phone_no_id}/messages`,
              data,
              requestConfig,
            )
            .pipe(
              map((response) => {
                return res.status(response.status).send();
              }),
            );
          return resp;
        } catch (error) {
          console.log(error);
        }
      } else {
        return res.status(HttpStatus.NOT_FOUND).send();
      }
    }
  }

  @Post('send-message')
  async sendMessage() {
    let reply = '';

    const config: any = {
      headers: {
        'X-RapidAPI-Key': '0bb1de8e02msh34cb401bfe95328p13898fjsnb450ab7c5409',
        'X-RapidAPI-Host': 'waifu.p.rapidapi.com',
        'Content-Type': 'application/json',
      },
    };

    const bot = {
      user_id: '1321313',
      message: 'Hi babe',
      from_name: 'Khai',
      to_name: 'Customer Support',
      situation: 'Customer asking for help',
      translate_from: 'auto',
      translate_to: 'auto',
    };

    try {
      const resp = await this.httpService.axiosRef.post(
        'https://waifu.p.rapidapi.com/v1/waifu',
        bot,
        config,
      );

      return this.send(resp.data['response'], null, null);
    } catch (error) {
      console.log(`masuk sini ${error}`);
    }
  }

  send(message: string, from: string, senderid: string) {
    const data = {
      messaging_product: 'whatsapp',
      to: from ?? '60132696972',
      text: { body: message },
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
          `https://graph.facebook.com/v15.0/${
            senderid ?? 112789665023600
          }/messages`,
          data,
          requestConfig,
        )
        .pipe(
          map((response) => {
            return response.data;
          }),
        );
      return resp;
    } catch (error) {
      console.log(error);
    }
  }

  // verify callback url from the cloud api
  @Get()
  handleWebhookGet(@Req() request: Request, @Res() res: Response) {
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
