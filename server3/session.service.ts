import { Injectable } from 'inject';
import { ExpressApp } from "./express.service.ts";
import { MongoService } from "./mongo.service.ts";
import session from "express-session";
import { EnvService } from "./env.service.ts";
import { SocketService } from "./socket.service.ts";
import { default as connectMongoDBSession} from 'npm:connect-mongodb-session';

@Injectable()
export class SessionService {

  constructor(
    private readonly app: ExpressApp,
    private readonly socketService: SocketService,
    private readonly env: EnvService,
    private readonly mongo: MongoService
  ){
  }

  async setupSessions() {
    const MongoDBStore = connectMongoDBSession(session);

    var store = new MongoDBStore({
      uri: this.env.env.MONGODB_URI,
      collection: 'sessions',
      crypto: {
        secret: this.env.env.SESSION_SECRET
      },
      mongoOptions: {
        appName: "Adler40",
        tls: true,
      },
    });

    const sessionMiddleware = session({
      secret: this.env.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      store: store,
      cookie: {
        httpOnly: false,
        secure: true,
        sameSite: "none",
        partitioned: true,
        maxAge: 6 * 60 * 60* 1000, //6 hours
      }
    });
    
    this.app.app.use(sessionMiddleware);
    this.socketService.io.engine.use(sessionMiddleware);
  }

}
