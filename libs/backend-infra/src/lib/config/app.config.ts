import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env['NODE_ENV'] || 'development',
  port: parseInt(process.env['PORT'] || '3000', 10),
  mongodbUri: process.env['MONGODB_URI'] || 'mongodb://localhost:27017/chat-app',
  redisUri: process.env['REDIS_URI'] || 'redis://localhost:6379',
  rabbitmqUri: process.env['RABBITMQ_URI'] || '',
  rabbitmqQueue: process.env['RABBITMQ_QUEUE'] || 'chat_messages',
}));


