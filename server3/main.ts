import { Bootstrapped, bootstrap } from "@dx/inject";
import { EnvService } from "./env.service.ts";

@Bootstrapped()
export class Main {
  constructor(
    private readonly env: EnvService,
  ) {}

  hello() {
    return this.env.getEnvVar("PORT")
  }
}

const main = bootstrap(Main) as Main;
console.log(main.hello());