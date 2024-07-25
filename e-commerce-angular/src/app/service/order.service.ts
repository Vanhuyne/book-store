import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order } from '../models/order';

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

  getTotalOrders(): Observable<number> {
    return this.http.get<number>(`${this.orderUrl}/total-orders`);
  }

  getTotalRevenue(): Observable<number> {
    return this.http.get<number>(`${this.orderUrl}/total-revenue`);
  }

  getMonthlyOrders(): Observable<number[]> {
    return this.http.get<number[]>(`${this.orderUrl}/monthly-orders`);
  }

}
