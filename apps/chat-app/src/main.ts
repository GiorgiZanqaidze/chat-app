/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { WinstonModule, utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { format as winstonFormat, transports as winstonTransports } from 'winston';
import { Request, Response, NextFunction } from 'express';

import { AppModule } from './app/app.module';
// Microservice bootstrap for RabbitMQ can be added later if needed

async function bootstrap() {
  const winstonLogger = WinstonModule.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transports: [
      new winstonTransports.Console({
        format: winstonFormat.combine(
          winstonFormat.timestamp(),
          winstonFormat.ms(),
          nestWinstonModuleUtilities.format.nestLike('Chat App', {
            colors: true,
            prettyPrint: true,
          })
        ),
      }),
    ],
  });

  const app = await NestFactory.create(AppModule, { logger: winstonLogger });
  // HTTP request logging
  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    const { method, originalUrl } = req;
    res.on('finish', () => {
      const { statusCode } = res;
      const durationMs = Date.now() - start;
      winstonLogger.log(
        `${method} ${originalUrl} ${statusCode} - ${durationMs}ms`,
        'HTTP'
      );
    });
    next();
  });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  const port = process.env.PORT || 3000;

  // Tip: To enable RabbitMQ microservice, register it here using Nest microservices API

  // Swagger setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Chat App API')
    .setDescription('API documentation for Chat App backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument, { useGlobalPrefix: true });
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
  Logger.log(`📘 Swagger docs available at: http://localhost:${port}/${globalPrefix}/docs`);
}

bootstrap();
