import { effect, inject, Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {

  private router = inject(Router);
  private socketService = inject(SocketService);
  private gameState = this.socketService.gameState;

  constructor() { 
    effect(() => {
      if (this.gameState()) {
        const scene = this.gameState()!.scene;
        console.log("Routing to: ", scene);
        this.router.navigateByUrl(scene);
      }
    })
  }
}
