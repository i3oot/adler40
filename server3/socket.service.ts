import { Injectable } from 'inject';
import { ExpressApp } from "./express.service.ts";
import { Server} from 'socket.io';
import { MongoService } from "./mongo.service.ts";
import {createAdapter} from 'mongo-adapter';

@Injectable()
export class SocketService {
  io: Server;

  constructor(
    app: ExpressApp,
    private readonly mongo: MongoService
  ){
    console.log("constructing socket")
    const httpServer = app.httpServer;
    this.io = new Server(httpServer, { path: '/game' });
  }

  async setupClustering() {
    const mongoCollection = this.mongo.db().collection('socketio');
    await mongoCollection.createIndex(
      { createdAt: 1 },
      { expireAfterSeconds: 5 * 60, background: true }
    );
    
    this.io.adapter(createAdapter(mongoCollection, {
      addCreatedAtField: true
    }));
  }

}
