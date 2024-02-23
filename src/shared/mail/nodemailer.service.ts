import { Injectable } from '@nestjs/common';

const Mailjet = require('node-mailjet');

@Injectable()
export class NodemailerService {
  async sendConfirmationEmail(to: string): Promise<void> {
    try {
      const MAIL_JET = Mailjet.apiConnect(
        process.env.API_KEY,
        process.env.SECRET_KEY,
      );

      const REQUEST = MAIL_JET.post('send', { version: 'v3.1' }).request({
        Messages: [
          {
            From: {
              Email: 'carloseli9623@gmail.com',
              Name: 'Carlos López',
            },
            To: [
              {
                Email: to,
              },
            ],
            Subject: 'Confirmación de registro',
            TextPart: '¡Gracias por registrarte en nuestra plataforma!',
          },
        ],
      });

      await REQUEST;
    } catch (error) {
      throw new Error('Error al enviar el email.');
    }
  }
}
