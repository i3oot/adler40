import { Injectable } from '@dx/inject';
import * as mod from "dotenv";

type AppConfig = {
    PORT: number
    DBUSER: string
    DBPASS: string
    MONGODB_URI: string
    SESSION_SECRET: string
    CLIENT_ID: string
    CLIENT_SECRET: string
}

@Injectable()
export class EnvService {

    private _env = mod.loadSync();

    get env(): AppConfig {
        return this.env as unknown as AppConfig
    }
}