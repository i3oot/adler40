import { inject, Injectable, signal } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket = inject(Socket)
  private connectedSignal = signal<boolean>(false);


  connectToRoom(room: string) {
    if (this.socket.ioSocket.connected) {
      this.connectedSignal.set(false);
      this.socket.disconnect();
    }

    this.socket.ioSocket.io.opts.query = {
      room: room
    };
    
    this.socket.connect();
    this.socket.on('connect', () => {
      console.log("Socket connection established. Now joining the fun.")
      this.connectedSignal.set(true);
      this.socket.emit("join");
    });
  }

  get connected() {
    return this.connectedSignal.asReadonly();
  }
}
