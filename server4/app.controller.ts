// app.controller.ts
import { Controller, Get, Req, Session } from '@nestjs/common';
import  Request  from 'express';

@Controller('/')
export class AppController {
  @Get()
  getRoot(@Req() req: Request): string {
    req.session.user = { name: 'TEst user' };
    return 'Welcome to the NestJS application!';
  }
}
