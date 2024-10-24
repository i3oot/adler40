import process from "node:process";
import { registerAs } from "@nestjs/config";

export default registerAs('oauth', () => ({
     clientId:  process.env.CLIENT_ID,
     clientSecret: process.env.CLIENT_SECRET,
}));