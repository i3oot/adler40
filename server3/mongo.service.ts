import { Injectable } from 'inject'
import { MongoClient, ServerApiVersion, MongoClientOptions, Db } from 'mongo'
import { EnvService } from "./env.service.ts";

@Injectable()
export class Client extends MongoClient {
  constructor(
    envService: EnvService
  ) { 
    const opts: MongoClientOptions = {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    } as MongoClientOptions
    super(envService.env.MONGODB_URI, opts)
  }
}


@Injectable()
export class MongoService {
  private _db: Db|null = null
 
  constructor(
    readonly client: Client,
    private readonly envService: EnvService

  ){   }
  
  async connect() {
      await this.client.connect();
      this._db = this.client.db(this.envService.env.DB_NAME);
      console.log('Connected to MongoDB');
  }

  db() : Db {
    if (!this.db) {
      throw new Error('Database connection is not established. Call connect() first.');
    }
    return this._db!;
  }

  // Method to close the connection
  async close() {
      await this.client.close();
      this._db = null;
      console.log('MongoDB connection closed');
  }


}