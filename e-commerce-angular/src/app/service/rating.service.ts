import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private baseUrl = environment.apiUrl + '/ratings';
  constructor(private http: HttpClient) {}

  addRating(productId: number, userId: number, ratingValue: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${productId}/${userId}`, { ratingValue });
  }

  getAverageRating(productId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/average/${productId}`);
  }
}
