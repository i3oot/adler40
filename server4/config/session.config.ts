import process from "node:process";
import { registerAs } from "@nestjs/config";

export interface SessionConfig {
     secret: string,
}
   
export const sessionConfig = registerAs<SessionConfig>('session', () => ({
      secret: process.env.SESSION_SECRET || 'aSecureSessionIsEncrypted'
}));