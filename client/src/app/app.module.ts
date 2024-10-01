import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = {
  url: '//',  
  options: {
    path: '/.proxy/game',
    autoConnect: false,
    transports: ["websocket", "polling"]
  }
};

@NgModule({
    imports: [
        CommonModule,
        SocketIoModule.forRoot(config)
    ],
    providers: [
        provideHttpClient(
            withInterceptorsFromDi()
        ),
    ]
})
export class AppModule {}