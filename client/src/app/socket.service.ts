import { inject, Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket = inject(Socket)

  connectToRoom(room: string) {
    if (this.socket.ioSocket.connected) {
      this.socket.disconnect();
    }

    this.socket.ioSocket.io.opts.query = {
      room: room
    };
    
    this.socket.connect();
  }
}
