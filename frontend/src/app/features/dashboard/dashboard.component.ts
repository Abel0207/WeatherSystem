import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService } from '../../core/services/weather.service';
import { TranslationService } from '../../core/services/translation.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard">
      <div class="search-section card mb-4">
        <div class="flex gap-4">
          <input type="text" class="input-field mb-0" [(ngModel)]="searchQuery" [placeholder]="t('dash.search_placeholder')" (keyup.enter)="searchWeather()">
          <button class="btn" (click)="searchWeather()">
            <i class="fa-solid fa-magnifying-glass"></i> {{ t('dash.search_btn') }}
          </button>
        </div>
      </div>

      <div class="main-content flex gap-4" [ngClass]="{'mobile-col': true}">
        
        <!-- Left: Weather Widget & Forecast -->
        <div class="weather-left">
          <div class="weather-widget card" *ngIf="currentWeather">
            <div class="flex justify-between items-center">
              <div>
                <h2 class="mb-0">{{ currentWeather.name }}</h2>
                <span class="text-primary font-bold"><i class="fa-solid fa-location-dot"></i> {{ getCountryName(currentWeather.sys.country) }}</span><br>
                <span class="text-muted text-sm">{{ getFullDate(currentWeather.dt) }}</span>
              </div>
              <button class="btn btn-fav" (click)="addFavorite()" [title]="t('weather.add_fav')">
                <i class="fa-solid fa-star"></i>
              </button>
            </div>
            
            <div class="weather-info mt-4 flex items-center justify-center gap-6">
              <img [src]="'http://openweathermap.org/img/wn/' + currentWeather.weather[0].icon + '@4x.png'" alt="icon">
              <div>
                <h1 class="temp">{{ currentWeather.main.temp | number:'1.0-0' }}°C</h1>
                <p class="desc">{{ currentWeather.weather[0].description }}</p>
              </div>
            </div>

            <div class="weather-details flex justify-between mt-4">
              <div>
                <p class="text-muted mb-0"><strong>{{ t('weather.feels_like') }}</strong></p>
                <p class="font-bold">{{ currentWeather.main.feels_like | number:'1.0-0' }}°C</p>
              </div>
              <div>
                <p class="text-muted mb-0"><strong>{{ t('weather.humidity') }}</strong></p>
                <p class="font-bold">{{ currentWeather.main.humidity }}%</p>
              </div>
              <div>
                <p class="text-muted mb-0"><strong>{{ t('weather.wind') }}</strong></p>
                <p class="font-bold">{{ currentWeather.wind.speed }} m/s</p>
              </div>
            </div>
          </div>

          <!-- 5 Day Forecast -->
          <div class="forecast-widget mt-4" *ngIf="forecastDays.length > 0">
            <h3 class="mb-2"><i class="fa-solid fa-calendar-days text-primary"></i> Previsão 5 Dias</h3>
            <div class="forecast-grid flex gap-2">
              <div class="card forecast-card text-center" *ngFor="let day of forecastDays">
                <p class="font-bold text-sm mb-0">{{ getWeekday(day.dt) | uppercase }}</p>
                <img [src]="'http://openweathermap.org/img/wn/' + day.weather[0].icon + '.png'" alt="icon" width="50" height="50">
                <p class="text-primary font-bold mb-0">{{ day.main.temp | number:'1.0-0' }}°</p>
                <small class="text-muted text-xs block truncate" [title]="day.weather[0].description">{{ day.weather[0].description }}</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Favorites & History -->
        <div class="side-panel">
          <div class="card mb-4">
            <h3 class="mt-0"><i class="fa-solid fa-heart text-danger"></i> {{ t('dash.favorites') }}</h3>
            <ul class="list-group scrollable-list">
              <li *ngFor="let fav of favorites" class="flex justify-between items-center">
                <span (click)="loadWeather(fav.city_name)" class="clickable">{{ fav.city_name }}</span>
                <button class="btn-icon text-danger" (click)="removeFavorite(fav.id)" [title]="t('weather.remove_fav')">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </li>
              <li *ngIf="favorites.length === 0" class="text-muted text-sm border-0">Nenhum favorito guardado.</li>
            </ul>
          </div>

          <div class="card">
            <div class="flex justify-between items-center mb-2">
              <h3 class="mt-0 mb-0"><i class="fa-solid fa-clock-rotate-left"></i> {{ t('dash.history') }}</h3>
              <button *ngIf="isAdmin" (click)="exportHistory()" class="btn btn-small" [title]="t('dash.export')">
                <i class="fa-solid fa-file-export"></i> {{ t('dash.export') }}
              </button>
            </div>
            <ul class="list-group mt-2 scrollable-list">
              <li *ngFor="let hist of history" class="history-item">
                <span (click)="loadWeather(hist.city_name)" class="clickable">{{ hist.city_name }}</span>
                <small class="text-muted">{{ hist.search_timestamp | date:'short' }}</small>
              </li>
              <li *ngIf="history.length === 0" class="text-muted text-sm border-0">Nenhum histórico disponível.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .dashboard { width: 100%; }
    .mobile-col { flex-wrap: wrap; }
    .weather-left { flex: 2; min-width: 300px; display: flex; flex-direction: column; }
    .side-panel { flex: 1; min-width: 300px; display: flex; flex-direction: column; }
    
    .mb-0 { margin-bottom: 0 !important; }
    .mt-0 { margin-top: 0 !important; }
    .text-xs { font-size: 0.75rem; }
    .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .block { display: block; }
    
    .search-section .input-field { margin-bottom: 0; }
    
    .temp { font-size: 3.5rem; margin: 0; color: var(--primary-color); line-height: 1; }
    .desc { font-size: 1.1rem; text-transform: capitalize; color: var(--text-muted); margin-top: 0.25rem; }
    .weather-details { border-top: 1px solid var(--card-border); padding-top: 1.25rem; margin-top: 1.5rem; }
    
    .btn-fav { background: none; border: 1px solid var(--card-border); color: var(--text-muted); padding: 0.4rem; border-radius: 6px; cursor: pointer; transition: all 0.2s; }
    .btn-fav:hover { background: rgba(217, 119, 6, 0.1); border-color: var(--primary-color); color: var(--primary-color); }
    
    .forecast-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.5rem; }
    .forecast-card { padding: 1rem 0.5rem; flex: 1; min-width: 0; }
    .text-primary { color: var(--primary-color); }
    .text-danger { color: var(--danger-color); }
    
    .list-group { list-style: none; padding: 0; margin: 0; }
    .list-group li { padding: 0.75rem 0; border-bottom: 1px solid var(--card-border); }
    .list-group li:last-child { border-bottom: none; }
    .list-group li.border-0 { border: none; padding-top: 0.5rem; }
    
    .scrollable-list { max-height: 250px; overflow-y: auto; padding-right: 5px; }
    .scrollable-list::-webkit-scrollbar { width: 4px; }
    .scrollable-list::-webkit-scrollbar-thumb { background: var(--card-border); border-radius: 10px; }
    
    .clickable { cursor: pointer; color: var(--text-color); font-weight: 500; transition: color 0.2s; }
    .clickable:hover { color: var(--primary-color); text-decoration: none; }
    
    .btn-icon { background: none; border: none; cursor: pointer; color: var(--text-muted); transition: color 0.2s; padding: 0.25rem; }
    .btn-icon:hover { color: var(--danger-color); }
    .role-badge.admin { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
    .role-badge.user { background: #f3f4f6; color: #374151; border: 1px solid #e5e7eb; }

    .action-buttons { display: flex; gap: 0.5rem; justify-content: flex-end; }
    .history-item { display: flex; justify-content: space-between; align-items: center; }
    .btn-small { padding: 0.35rem 0.75rem; font-size: 0.75rem; display: flex; align-items: center; gap: 0.4rem; }
  `]
})
export class DashboardComponent implements OnInit {
  searchQuery = '';
  currentWeather: any;
  forecastDays: any[] = [];
  favorites: any[] = [];
  history: any[] = [];
  isAdmin = false;

  constructor(
    private weatherService: WeatherService,
    private i18n: TranslationService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.auth.currentUser.subscribe(user => {
      this.isAdmin = user?.role === 'admin';
    });
    this.initLocation();
    this.loadFavorites();
    this.loadHistory();
  }

  initLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.loadWeatherByCoords(position.coords.latitude, position.coords.longitude);
        },
        () => {
          this.loadWeather('Luanda');
        }
      );
    } else {
      this.loadWeather('Luanda');
    }
  }

  t(key: string): string {
    return this.i18n.translate(key);
  }

  getWeekday(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    const lang = this.i18n.currentLanguage;
    return date.toLocaleDateString(lang === 'pt' ? 'pt-PT' : 'en-US', { weekday: 'short' });
  }

  getFullDate(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    const lang = this.i18n.currentLanguage;
    return date.toLocaleDateString(lang === 'pt' ? 'pt-PT' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  searchWeather() {
    if(this.searchQuery) {
      this.loadWeather(this.searchQuery);
    }
  }

  getCountryName(code: string): string {
    const countries: { [key: string]: string } = {
      'AO': 'Angola',
      'BR': 'Brasil',
      'PT': 'Portugal',
      'US': 'USA',
      'GB': 'United Kingdom',
      'FR': 'França',
      'ES': 'Espanha',
      'DE': 'Alemanha',
      'IT': 'Itália',
      'AR': 'Argentina'
    };
    return countries[code] || code;
  }

  loadWeather(city: string) {
    const lang = this.i18n.currentLanguage;
    this.currentWeather = null;
    this.forecastDays = [];

    this.weatherService.getCurrentWeather(city, lang).subscribe({
      next: (data) => {
        this.currentWeather = data;
        this.searchQuery = data.name; // Update input with found city name
        this.loadHistory();
      },
      error: (err) => {
        this.currentWeather = null;
        this.forecastDays = [];
        alert(this.t('error.city_not_found'));
        console.error(err);
      }
    });

    this.weatherService.getForecast(city, lang).subscribe({
      next: (data) => this.processForecast(data),
      error: (err) => console.error(err)
    });
  }

  loadWeatherByCoords(lat: number, lon: number) {
    const lang = this.i18n.currentLanguage;
    this.currentWeather = null;
    this.forecastDays = [];

    this.weatherService.getCurrentWeatherByCoords(lat, lon, lang).subscribe({
      next: (data) => {
        this.currentWeather = data;
        this.searchQuery = data.name;
        this.loadHistory();
      },
      error: (err) => {
        this.currentWeather = null;
        this.forecastDays = [];
        console.error(err);
      }
    });

    this.weatherService.getForecastByCoords(lat, lon, lang).subscribe({
      next: (data) => this.processForecast(data),
      error: (err) => console.error(err)
    });
  }

  processForecast(data: any) {
    if (!data || !data.list) return;
    
    const dailyMap = new Map();
    
    data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dateString = date.toISOString().split('T')[0];
      
      if (!dailyMap.has(dateString)) {
        dailyMap.set(dateString, item);
      } else {
        const hour = date.getHours();
        if (hour >= 11 && hour <= 14) {
          dailyMap.set(dateString, item);
        }
      }
    });

    this.forecastDays = Array.from(dailyMap.values()).slice(0, 5);
  }

  loadFavorites() {
    this.weatherService.getFavorites().subscribe(data => this.favorites = data);
  }

  addFavorite() {
    if(this.currentWeather) {
      this.weatherService.addFavorite(this.currentWeather.name, this.currentWeather.sys.country).subscribe(() => {
        this.loadFavorites();
      });
    }
  }

  removeFavorite(id: number) {
    this.weatherService.removeFavorite(id).subscribe(() => {
      this.loadFavorites();
    });
  }

  loadHistory() {
    this.weatherService.getHistory().subscribe(data => this.history = data);
  }

  exportHistory() {
    const token = this.auth.getToken();
    window.open(`http://localhost/WeatherSystem/backend/api/export.php?token=${token}`, '_blank');
  }
}
