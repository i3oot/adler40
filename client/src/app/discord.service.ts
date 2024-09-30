import { Injectable, signal } from '@angular/core';
import { AppConfig, ConfigService } from './config.service';  // Assume this is where your config$ observable is defined
import { DiscordSDK } from '@discord/embedded-app-sdk';

@Injectable({
  providedIn: 'root',
})
export class DiscordService {
  private discordSdk!: DiscordSDK;
  private instanceIdSignal = signal<string | null>(null);

  constructor(private configService: ConfigService) {
    this.configService.config$.subscribe(config => {
        this.initializeDiscord(config);
    });
  }

  private initializeDiscord(config: AppConfig) {
    this.discordSdk = new DiscordSDK(config.clientId);
    this.setupDiscord(config);
  }

  private async setupDiscord(config: AppConfig) {
    await this.discordSdk.ready();

    const { code } = await this.discordSdk.commands.authorize({
      client_id: config.clientId,
      response_type: 'code',
      state: '',
      prompt: 'none',
      scope: [
        'identify',
//        'applications.commands',
        'rpc.activities.write',
      ],
    });

    // Retrieve an access_token from your embedded app's server
    const response = await fetch('/.proxy/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
      }),
    });

    const { access_token } = await response.json();

    // Authenticate with Discord client (using the access_token)
    await this.discordSdk.commands.authenticate({
      access_token,
    });

    this.instanceIdSignal.set(this.discordSdk.instanceId);
  }

  get instanceId() {
    return this.instanceIdSignal.asReadonly();
  }

}
