import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl + '/users';

  constructor(
    private http : HttpClient
  ) { }

  getAllUsers(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get(`${this.apiUrl}`, { params });
  }

  getUserById(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`);
  }

  updateUserStatus(userId: number, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${userId}/status`, null, { params: { status } });
  }

  getRecentUsers(limit: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/recent`, { params: { limit: limit.toString() } });
  }

  getTotalUserCount(): Observable<any> {
    return this.http.get(`${this.apiUrl}/count`);
  }

  getActiveUserCount(): Observable<any> {
    return this.http.get(`${this.apiUrl}/count/active`);
  }
  
}
