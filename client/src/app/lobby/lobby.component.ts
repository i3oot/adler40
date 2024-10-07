import { computeMsgId } from '@angular/compiler';
import { Component, computed, effect, inject } from '@angular/core';
import { GameStateService } from '../game-state.service';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.sass'
})
export class LobbyComponent {
  private socketService = inject(SocketService);
  private gameState = this.socketService.gameState;
  users = computed(() => this.gameState()?.lobby )

  constructor() { 
    effect(() => {
      if (this.gameState()) {
        const scene = this.gameState()!.scene;
        console.log("Routing to: ", scene);
      }
    })
  }

  startGame() {
    console.log("Starting Game.")
  }

  isStartGameEnabled() {
    return false;
  }
}
