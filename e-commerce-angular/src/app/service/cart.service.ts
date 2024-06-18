import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Cart } from '../shared/dto/cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = environment.apiUrl + '/cart'; 

  constructor(private http : HttpClient) { }

  addProductToCart(userId: number, productId: number, quantity: number): Observable<Cart> {
    const url = `${this.apiUrl}/add`;
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('productId', productId.toString())
      .set('quantity', quantity.toString());

    return this.http.post<Cart>(url, {}, { params });
  }

  getCart(userId: number): Observable<Cart> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get<Cart>(`${this.apiUrl}`, { params });
  }
  
  removeCartItem(userId: number, cartItemId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove/${userId}/${cartItemId}`);
  }

  clearCart(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}/clear`);
  }
}
