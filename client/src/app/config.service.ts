import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private configSubject = new BehaviorSubject<AppConfig | null>(null);
  
  // Expose config$ observable, filtering out null values
  public config$: Observable<AppConfig> = this.configSubject.asObservable().pipe(
    filter((config): config is AppConfig => config !== null)
  );

  constructor(private http: HttpClient) {
    // Load config immediately upon service creation
    this.loadConfig();
  }

  // Load config from the server
  private loadConfig(): void {
    this.http.get<AppConfig>('/.proxy/config.json').subscribe({
      next: (config) => {
        this.configSubject.next(config);
      },
      error: (error) => {
        console.error('Failed to load config', error);
      }
    });
  }
}

// Interface for the configuration
export interface AppConfig {
  clientId: string;
}
