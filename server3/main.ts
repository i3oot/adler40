import { Bootstrapped, bootstrap } from "inject";
import { ExpressApp } from "./express.service.ts";
import { MongoService } from "./mongo.service.ts";

@Bootstrapped()
export class Main {
  constructor(
    private readonly mongo: MongoService,
    private readonly express: ExpressApp
  ) {  }

  async run() {
    await this.mongo.connect()
    await this.express.listen()
  }
}

const main = bootstrap(Main) as Main
await main.run()