import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

export const RABBITMQ_CLIENT = 'RABBITMQ_CLIENT';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: RABBITMQ_CLIENT,
        inject: [ConfigService],
        useFactory: (config: ConfigService) => {
          const urls = [config.get<string>('app.rabbitmqUri') || ''];
          const queue = config.get<string>('app.rabbitmqQueue') || 'chat_messages';
          return {
            transport: Transport.RMQ,
            options: { urls, queue, queueOptions: { durable: true } },
          };
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class RabbitmqModule {}


