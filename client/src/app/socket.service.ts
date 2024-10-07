import { inject, Injectable, signal } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { GameState } from './model/game-state';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket = inject(Socket)
  private connectedSignal = signal<boolean>(false);
  private gameStateSignal = signal<GameState|null>(null);

  constructor () {
    this.socket.on('connect', () => {
      console.log("Socket connection established. Now joining the fun.")
      this.connectedSignal.set(true);
      this.socket.emit("join");
    });

    this.socket.on("game-state", (gs: GameState) => {
      this.gameStateSignal.set(gs);
    });
  }

  connectToRoom(room: string) {
    if (this.socket.ioSocket.connected && this.socket.ioSocket.io.opts.query != room) {
      console.log("Disconnecting.")
      this.socket.disconnect();
    }

    console.log("Connecting.")
    this.socket.ioSocket.io.opts.query = {
      room: room
    };
    this.socket.connect();
  }

  get connected() {
    return this.connectedSignal.asReadonly();
  }

  get gameState() {
    return this.gameStateSignal.asReadonly();
  }
}
