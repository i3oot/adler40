import { Injectable, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Board } from './types/board.type';

@Injectable({
  providedIn: 'root'
})
export class BoardService implements OnInit {

  constructor(private socket: Socket) { }
  
  ngOnInit(): void {
    this.socket.on("board", this.update)
  }

  update(update: Board) {
    console.log("Board updated: ", update)
  }
}
