// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig } from './config/database.config.ts';
import { sessionConfig } from './config/session.config.ts';

import { ServerModule } from './server/server.module.ts';
import { NestFactory } from "@nestjs/core";
import process from "node:process";
import { AppController } from './app.controller.ts';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      load: [databaseConfig, sessionConfig], 
      expandVariables: true
    }),
    ServerModule,
  ],
  controllers: [AppController], 
})
export class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();


