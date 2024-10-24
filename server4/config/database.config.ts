import process from "node:process";
import { registerAs } from "@nestjs/config";


export interface DatabaseConfig {
    user: string,
    pass: string,
    name: string,
    server: string,
    uri: string
}
  
export const databaseConfig = registerAs<DatabaseConfig>('database', () => ({
     user: process.env.DBUSER || 'appuser',
     pass: process.env.DBPASS || '',
     name: process.env.DB_NAME || 'Adler40',
     server: process.env.DB_SERVER || 'localhost',
     uri: process.env.MONGODB_URI!,
 }));