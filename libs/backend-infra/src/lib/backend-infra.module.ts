import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import { DatabaseModule } from './config/database.module';
import { RedisModule } from './config/redis.module';
import { RabbitmqModule } from './config/rabbitmq.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      expandVariables: true,
    }),
    DatabaseModule,
    RedisModule,
    RabbitmqModule,
  ],
  controllers: [],
  providers: [],
  exports: [DatabaseModule, RedisModule, RabbitmqModule],
})
export class BackendInfraModule {}
