import { Component, effect, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DiscordService } from './discord.service';
import { inject } from '@angular/core';
import { SocketService } from './socket.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {
  title = 'Adler40'
  private discord = inject(DiscordService)
  private socket = inject(SocketService)
  private instanceId = this.discord.instanceId
  connected = this.socket.connected

  constructor() {
    effect(() => {
      if (this.instanceId()) {
        const id = this.instanceId()!
        console.log("Joining room ", id)
        this.socket.connectToRoom(id)
      }
    })
  }

}
