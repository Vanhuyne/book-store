import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { UserRegistrationDTO } from '../models/auth/user-registration-dto';
import { AuthRequest } from '../models/auth/auth-request';
import { AuthResponse } from '../models/auth/auth-response';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl + '/auth';
  private readonly tokenKey = 'authToken';
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) { }

  register (user: UserRegistrationDTO) : Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  login(authRequest: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, authRequest).pipe(
      tap((response) => this.setToken(response.token))
    );
  }
  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getUsernameFromToken(): string | null{
    const token = this.getToken();
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      console.log(decodedToken);
      
      return decodedToken ? decodedToken.sub : null;
    }
    return null;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }
}
