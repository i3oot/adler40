// server.module.ts
import { Module, RequestMethod, type MiddlewareConsumer, type NestModule } from '@nestjs/common';
import { MongoService, Client } from './mongo.service.ts';
import { ConfigService } from '@nestjs/config';
import { SessionMiddleware } from './session.middleware.ts';

@Module({
  providers: [Client, MongoService, ConfigService],
  exports: [MongoService],
})
export class ServerModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(SessionMiddleware) 
        .forRoutes({ path: '*', method: RequestMethod.ALL });
    }
  } 