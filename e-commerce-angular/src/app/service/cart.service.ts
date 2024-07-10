import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Cart } from '../models/cart';
import { CartItem } from '../models/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = environment.apiUrl + '/cart'; 
  private cartSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);


  constructor(private http : HttpClient) { }

  addProductToCart(userId: number, productId: number, quantity: number): Observable<Cart> {
    const url = `${this.apiUrl}/add`;
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('productId', productId.toString())
      .set('quantity', quantity.toString());

      return this.http.post<Cart>(url, {}, { params }).pipe(
        tap(() => {
          this.updateCartCount(userId); // Update cart count after adding
        })
      );

  }

  getCart(userId: number): Observable<Cart> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get<Cart>(`${this.apiUrl}`, { params });
  }
  
  removeCartItem(userId: number, cartItemId: number): Observable<void> {
    const url = `${this.apiUrl}/remove/${userId}/${cartItemId}`;
    return this.http.delete<void>(url).pipe(
      tap(() => {
        this.updateCartCount(userId); // Update cart count after removing
      })
    );
  }

  clearCart(userId: number): Observable<void> {

    return this.http.delete<void>(`${this.apiUrl}/clear/${userId}`).pipe(
      tap(() => {
        this.updateCartCount(userId); // Update cart count after clearing
      })
    );
  }

  increaseQuantity(userId: number, cartItemId: number): Observable<CartItem> {
    const url = `${this.apiUrl}/${userId}/increaseQuantity/${cartItemId}`;
    return this.http.post<CartItem>(url, {}).pipe(
      tap(() => {
        this.updateCartCount(userId); // Update cart count after increasing quantity
      })
    );
  }

  decreaseQuantity(userId: number, cartItemId: number): Observable<CartItem> {
    const url = `${this.apiUrl}/${userId}/decreaseQuantity/${cartItemId}`;
    return this.http.post<CartItem>(url, {}).pipe(
      tap(() => {
        this.updateCartCount(userId); // Update cart count after decreasing quantity
      })
    );
  }

  getCartCount(): Observable<number> {
    return this.cartSubject.asObservable();
  }

  updateCartCount(userId: number): void {
    this.getCart(userId).subscribe((cart) => {
      this.cartSubject.next(cart.cartItems.length);
    });
  }
}
