import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = 'http://localhost/WeatherSystem/backend/api/weather.php';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.auth.getToken()}`
    });
  }

  getCurrentWeather(city: string, lang: string = 'pt'): Observable<any> {
    return this.http.get(`${this.apiUrl}?action=current&city=${city}&lang=${lang}`, { headers: this.getHeaders() });
  }

  getCurrentWeatherByCoords(lat: number, lon: number, lang: string = 'pt'): Observable<any> {
    return this.http.get(`${this.apiUrl}?action=current&lat=${lat}&lon=${lon}&lang=${lang}`, { headers: this.getHeaders() });
  }

  getForecast(city: string, lang: string = 'pt'): Observable<any> {
    return this.http.get(`${this.apiUrl}?action=forecast&city=${city}&lang=${lang}`, { headers: this.getHeaders() });
  }

  getForecastByCoords(lat: number, lon: number, lang: string = 'pt'): Observable<any> {
    return this.http.get(`${this.apiUrl}?action=forecast&lat=${lat}&lon=${lon}&lang=${lang}`, { headers: this.getHeaders() });
  }

  getFavorites(): Observable<any> {
    return this.http.get(`${this.apiUrl}?action=favorites`, { headers: this.getHeaders() });
  }

  addFavorite(cityName: string, countryCode: string = ''): Observable<any> {
    return this.http.post(`${this.apiUrl}?action=favorites`, { city_name: cityName, country_code: countryCode }, { headers: this.getHeaders() });
  }

  removeFavorite(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}?action=favorites&id=${id}`, { headers: this.getHeaders() });
  }

  getHistory(): Observable<any> {
    return this.http.get(`${this.apiUrl}?action=history`, { headers: this.getHeaders() });
  }
}
