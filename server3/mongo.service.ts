import { Injectable } from '@dx/inject';
import type { EnvService } from "./env.service.ts";

const { MongoClient, ServerApiVersion } = require('mongodb');

@Injectable()
class MongoService {
  constructor(
    private envService: EnvService
  ) {
    
    this.mongoUrl = this.envService.env.MONGODB_URI
    this.dbName = 
    this.client = 
    this.db = 
  }

  // Method to initialize and connect to the MongoDB
  async connect() {
    if (!this.client) {
      this.client = new MongoClient(this.mongoUrl, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
      });

      try {
        await this.client.connect();
        this.db = this.client.db(this.dbName);
        console.log('Connected to MongoDB');
      } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        throw error;
      }
    }
  }

  client() {
    if (!this.client) {
        throw new Error('Database connection is not established. Call connect() first.');
      }
      return this.client;
  }

  db() {
    if (!this.db) {
      throw new Error('Database connection is not established. Call connect() first.');
    }
    return this.db;
  }

  // Method to close the connection
  async close() {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      console.log('MongoDB connection closed');
    }
  }
}

module.exports = MongoService;
