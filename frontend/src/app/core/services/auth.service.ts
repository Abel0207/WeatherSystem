import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost/WeatherSystem/backend/api';
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<any>(savedUser ? JSON.parse(savedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login.php`, { email, password })
      .pipe(tap(res => {
        if (res && res.token) {
          const userData = { ...res.user, token: res.token };
          localStorage.setItem('currentUser', JSON.stringify(userData));
          this.currentUserSubject.next(userData);
        }
      }));
  }

  register(name: string, email: string, password: string, role: string = 'user'): Observable<any> {
    return this.http.post(`${this.apiUrl}/register.php`, { name, email, password, role });
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getToken(): string {
    const user = this.currentUserValue;
    return user && user.token ? user.token : '';
  }

  updateCurrentUser(user: any) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot_password.php`, { email });
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset_password.php`, { token, password });
  }
}
