import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SocketIoModule, SocketIoConfig } from "ngx-socket-io";

const socketConfig = {
    url: "//",
    options: {}
}

@NgModule({
    imports: [
        CommonModule,
        SocketIoModule.forRoot(socketConfig),
    ],
    providers: [SocketIoModule]
})
export class AppModule {}