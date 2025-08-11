import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis, { Redis as IoRedisClient } from 'ioredis';

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: async (config: ConfigService): Promise<IoRedisClient> => {
        const url = config.get<string>('app.redisUri');
        const client = new Redis(url || 'redis://localhost:6379');
        return client;
      },
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}


