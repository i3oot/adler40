import { Injectable, OnInit } from '@angular/core';
import { Board } from './types/board.type';

@Injectable({
  providedIn: 'root'
})
export class BoardService implements OnInit {

  constructor() { }
  
  ngOnInit(): void {
  }

  update(update: Board) {
    console.log("Board updated: ", update)
  }
}
