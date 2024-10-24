import { MongoClient, ServerApiVersion, MongoClientOptions, Db } from 'mongodb'
import { Injectable, Logger, type OnModuleDestroy, type OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DatabaseConfig } from '../config/database.config.ts';


@Injectable()
export class Client extends MongoClient {
  constructor(
    config: ConfigService
  ) { 
    const dbConfig = config.getOrThrow<DatabaseConfig>('database')
    const opts: MongoClientOptions = {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    } as MongoClientOptions
    super(dbConfig.uri, opts)
  }
}


@Injectable()
export class MongoService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MongoService.name); 
  private _db: Db|null = null
  private dbConfig: DatabaseConfig

  constructor(
    readonly client: Client,
    config: ConfigService 
  ){ 
    this.dbConfig = config.getOrThrow<DatabaseConfig>('database')
  }

  async onModuleInit() {
    await this.client.connect()
    this._db = this.client.db(this.dbConfig.name)
    this.logger.log('Connected to MongoDB')
  }
  
  async onModuleDestroy() {
    await this.client.close()
    this._db = null
    this.logger.log('MongoDB connection closed')
  }

  get db() : Db {
    if (!this.db) {
      throw new Error('Database connection is not established. Call connect() first.')
    }
    return this._db!
  }
}