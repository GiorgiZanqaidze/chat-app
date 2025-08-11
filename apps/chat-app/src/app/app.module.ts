import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from '@chat-app/backend-infra';
import { AuthModule } from '@chat-app/auth';
import { ChatsModule } from '@chat-app/chats';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BackendInfraModule } from '@chat-app/backend-infra';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      expandVariables: true,
    }),
    BackendInfraModule,
    AuthModule,
    ChatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
