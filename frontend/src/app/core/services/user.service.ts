import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost/WeatherSystem/backend/api/users.php';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.auth.getToken()}`
    });
  }

  getUsers(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}?id=${id}`, { headers: this.getHeaders() });
  }

  createUser(userData: any): Observable<any> {
    return this.http.post(this.apiUrl, userData, { headers: this.getHeaders() });
  }

  updateUser(userData: any): Observable<any> {
    return this.http.put(this.apiUrl, userData, { headers: this.getHeaders() });
  }

  updateProfile(userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}?action=self`, userData, { headers: this.getHeaders() });
  }

  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}?action=stats`, { headers: this.getHeaders() });
  }
}
