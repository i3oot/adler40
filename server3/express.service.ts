import { Injectable } from 'inject';
import {Express} from "express";
import express from "express";
import { EnvService } from "./env.service.ts";
import { createServer, Server } from "node:http";

@Injectable()
export class ExpressApp {
    app: Express
    httpServer: Server

    constructor(
        private readonly envService: EnvService
    ){
        console.log(envService.env)
        this.app = express()
        this.app.set('trust proxy', 1);
        this.app.disable('x-powered-by');
        this.app.use(express.json());
        this.httpServer = createServer(this.app);
    }

    listen() {
        const port = this.envService.env.PORT
        this.app.listen(port, () => {
            console.log(`application is running at: http://localhost:${port}`);
        });
    }
}




