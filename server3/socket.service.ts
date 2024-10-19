import { Injectable } from 'inject'
import { ExpressApp } from "./express.service.ts";
import { Server } from "socket.io";
import { MongoService } from "./mongo.service.ts";


@Injectable()
export class SocketService extends Server {

    constructor(
        private readonly app: ExpressApp,
        private readonly mongo: MongoService 
    ){
        //on init
        const mongoCollection = mongo.db.collection('socketio');
        await mongoCollection.createIndex(
          { createdAt: 1 },
          { expireAfterSeconds: 5 * 60, background: true }
        );
        
        this.io.adapter(createAdapter(mongoCollection, {
          addCreatedAtField: true
        }));
    
        super(app.httpServer, { path: '/game' })
    }

    
}
