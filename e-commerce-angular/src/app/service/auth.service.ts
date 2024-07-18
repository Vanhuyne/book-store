import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, map, Observable, switchMap, tap } from 'rxjs';
import { UserRegistrationDTO } from '../models/auth/user-registration-dto';
import { AuthRequest } from '../models/auth/auth-request';
import { AuthResponse } from '../models/auth/auth-response';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserDTO } from '../models/auth/user-dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl + '/auth';
  private readonly tokenKey = 'authToken';

  private jwtHelper = new JwtHelperService();
  private userSubject = new BehaviorSubject<UserDTO | null>(null);
  constructor(private http: HttpClient) { }

  register(user: UserRegistrationDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  login(authRequest: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, authRequest).pipe(
      tap((response) => {
        this.setToken(response.token);
        this.loadUserDetails().subscribe();
      })
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
    this.clearUser();
  }

  getUsernameFromToken(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      console.log(decodedToken);

      return decodedToken ? decodedToken.sub : null;
    }
    return null;
  }

  getUserByUsername(username: string): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.baseUrl}/username/${username}`);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return token != null && !this.jwtHelper.isTokenExpired(token);

  }

  setUser(user: UserDTO): void {
    this.userSubject.next(user);
  }

  getUser(): Observable<UserDTO | null> {
    return this.userSubject.asObservable();
  }

  clearUser(): void {
    this.userSubject.next(null);
  }

  loadUserDetails(): Observable<UserDTO | null> {
    const username = this.getUsernameFromToken();
    if (username) {
      return this.getUserByUsername(username).pipe(
        tap(user => this.setUser(user))
      );
    }
    return new Observable<UserDTO | null>(subscriber => subscriber.next(null));
  }

  requestPasswordReset(email: string): Observable<any> {
    let params = new HttpParams().set('email', email);
    return this.http.post(`${this.baseUrl}/request-password-reset`, {}, { params: params, responseType: 'text' });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password?token=${token}`, { newPassword }, { responseType: 'text' });
  }

  getCurrentUser(): Observable<UserDTO | null> {
    return this.http.get<UserDTO>(`${this.baseUrl}/profile`);
  }

  updateProfile(userDTO: UserDTO): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.baseUrl}/profile`, userDTO);
  }

  updateProfilePicture(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.put(`${this.baseUrl}/profile-picture`, formData, { headers, responseType: 'text' });
  }

  loginWithGoogle(user: any) {
    return this.http.post<any>('/api/auth/google', { user });
  }
  

}
