const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const {createAdapter} = require("@socket.io/mongo-adapter");

class ServerService {
  constructor(mongoService, sessionSecret) {
    this.app = express();
    this.mongoService = mongoService;
    this.sessionSecret = sessionSecret;

    this._setupApp();
  }

  async _setupClustering() {
    const mongoCollection = this.mongoService.db.collection('socketio');
    await mongoCollection.createIndex(
      { createdAt: 1 },
      { expireAfterSeconds: 5 * 60, background: true }
    );
    
    this.io.adapter(createAdapter(mongoCollection, {
      addCreatedAtField: true
    }));
  }

  async _setupSessions() {
    const sessionMiddleware = session({
      secret: this.sessionSecret,
      resave: false,
      saveUninitialized: true,
      store: MongoStore.create({
        client: this.mongoService.client,
        dbName: this.mongoService.dbName,
        crypto: {
          secret: this.sessionSecret
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
    
    this.app.use(sessionMiddleware);
    this.io.engine.use(sessionMiddleware);
  }

  async _setupApp() {
    this.app.set('trust proxy', 1);
    this.app.disable('x-powered-by');
    this.app.use(express.json());
    this.httpServer = createServer(this.app);
    this.io = new Server(this.httpServer, { path: '/game' });
  }

  async init() {
    await this._setupApp();
    await this.mongoService.connect();
    await this._setupSessions();
    await this._setupClustering();
  }

  async startServer(port) {
    this.httpServer.listen(port, () => {
      console.log(`application is running at: http://localhost:${port}`);
    });
  }

}

module.exports = ServerService;
