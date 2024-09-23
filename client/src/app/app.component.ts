import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent implements OnInit {
  title = 'Adler40';

  constructor(private socket: Socket) { }

  ngOnInit(): void {
    console.log("connecting")
    this.socket.connect(console.log)
  }
}
