import { AbstractHttpAdapter, HttpAdapterHost } from '@nestjs/core';
import { MongoService } from './mongo.service.ts';
import session from 'express-session';
import { default as connectMongoDBSession } from 'npm:connect-mongodb-session';
import { Injectable, NestMiddleware, type OnModuleInit } from "@nestjs/common";
import type { DatabaseConfig } from "../config/database.config.ts";
import type { SessionConfig } from "../config/session.config.ts";
import { ConfigService } from "@nestjs/config";
import { Request, Response, NextFunction } from 'express';
import MongoStore from 'npm:connect-mongo';

@Injectable()
export class SessionMiddleware implements NestMiddleware, OnModuleInit {
  private dbConfig: DatabaseConfig
  private sConfig: SessionConfig
  private sessionMiddleware: any;

  constructor(
    private readonly mongo: MongoService,
    config: ConfigService
    
  ) {
    this.dbConfig = config.getOrThrow<DatabaseConfig>('database')
    this.sConfig = config.getOrThrow<SessionConfig>('session')
  }

  use(req: Request, res: Response, next: NextFunction) {
    this.sessionMiddleware(req, res, next)
  }

  onModuleInit() {
    this.sessionMiddleware = session({
      secret: this.sConfig.secret,
      resave: false,
      saveUninitialized: true,
      store: MongoStore.create({
        client: this.mongo.client,
        dbName: this.dbConfig.name,
        crypto: {
          secret: this.sConfig.secret
        },
        mongoOptions: {
          appName: "Adler40",
          tls: true,
        },
      }),
      cookie: {
        httpOnly: false,
        secure: true,
        sameSite: "none",
        partitioned: true,
        maxAge: 6 * 60 * 60* 1000, //6 hours
      }
    });    
  }
}
