import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SocketIoModule, SocketIoConfig } from "ngx-socket-io";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';


const socketConfig = {
    url: "//",
    options: {
    }
}

@NgModule({
    imports: [
        CommonModule,
        SocketIoModule.forRoot(socketConfig),
    ],
    providers: [
        SocketIoModule,
        provideHttpClient(
            withInterceptorsFromDi()
        ),
    ]
})
export class AppModule {}