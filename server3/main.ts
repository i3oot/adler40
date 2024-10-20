import { Bootstrapped, bootstrap } from "inject";
import { ExpressApp } from "./express.service.ts";
import { MongoService } from "./mongo.service.ts";
import { SocketService } from "./socket.service.ts";
import { SessionService } from "./session.service.ts";

@Bootstrapped()
export class Main {
  constructor(
    private readonly socket: SocketService,
    private readonly sessions: SessionService,
    private readonly mongo: MongoService,
    private readonly express: ExpressApp
  ) {  }

  async run() {
    await this.mongo.connect()
    await this.socket.setupClustering()
    await this.sessions.setupSessions()
    await this.express.listen()
  }
}

const main = bootstrap(Main) as Main
await main.run()