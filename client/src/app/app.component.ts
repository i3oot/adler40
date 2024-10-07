import { Component, effect, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DiscordService } from './discord.service';
import { inject } from '@angular/core';
import { SocketService } from './socket.service';
import { NgOptimizedImage } from '@angular/common';
import { GameStateService } from './game-state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgOptimizedImage],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {
  title = 'Adler40'
  private discord = inject(DiscordService)
  private socket = inject(SocketService)
  private instanceId = this.discord.instanceId
  connected = this.socket.connected
  private gs = inject(GameStateService);

  constructor() {
    effect(() => {
      if (this.instanceId()) {
        const id = this.instanceId()!
        console.log("Joining room ", id)
        this.socket.connectToRoom(id)
      }
    }, { allowSignalWrites: true } )
  }

}
