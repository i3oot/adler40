import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LobbyComponent } from './lobby/lobby.component';

export const routes: Routes = [
    {
        path: '',
        title: 'Connecting - Adler40',
        component: AppComponent,
    },
    {
        path: 'lobby',
        title: 'Lobby - Adler40',
        component: LobbyComponent,
    },

];
