const { MongoClient, ServerApiVersion } = require('mongodb');

class MongoService {
  constructor(mongoUrl, dbName) {
    this.mongoUrl = mongoUrl;
    this.dbName = dbName;
    this.client = null;
    this.db = null;
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
