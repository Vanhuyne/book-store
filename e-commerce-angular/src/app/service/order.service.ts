import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order } from '../models/order';
import { Page } from '../models/page';

export interface OrdersCountProjection {
  date: string;
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orderUrl = `${environment.apiUrl}/orders`;

  constructor(
    private http: HttpClient  ) {}

  placeOrder(order: Order): Observable<Order> {
    const url = `${this.orderUrl}/place-order`;
    return this.http.post<Order>(url, order);
  }

  getOrders(page: number, size: number): Observable<Page<Order>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

      return this.http.get<Page<Order>>(this.orderUrl, { params }).pipe(
        catchError(this.handleError)
      );
  }

  getTotalOrders(): Observable<number> {
    return this.http.get<number>(`${this.orderUrl}/total-orders`);
  }

  getTotalRevenue(): Observable<number> {
    return this.http.get<number>(`${this.orderUrl}/total-revenue`);
  }

  getOrdersSince(): Observable<OrdersCountProjection[]> {
    return this.http.get<OrdersCountProjection[]>(`${this.orderUrl}/since`);
  }

  getOrderById(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.orderUrl}/${orderId}`);
  }

  updateOrder(order: Order): Observable<Order> {
    if (!order || !order.orderId) {
      throw new Error('Order or orderId is missing');
    }
    return this.http.put<Order>(`${this.orderUrl}/${order.orderId}`, order);
  }

  deleteOrder(orderId: number): Observable<void> {
    return this.http.delete<void>(`${this.orderUrl}/${orderId}`);
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }

}
