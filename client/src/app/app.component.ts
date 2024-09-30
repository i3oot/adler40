import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { DiscordService } from './discord.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent implements OnInit {
  title = 'Adler40';
  private socket = inject(Socket)
  private discord = inject(DiscordService)
  instanceId = this.discord.instanceId

  ngOnInit(): void {
    console.log("connecting")
    //this.socket.connect(console.log)
  }
}
