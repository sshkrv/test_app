import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = 'http://localhost:8000';
  }

  getApiUrl(): string {
    return this.apiUrl;
  }
}
