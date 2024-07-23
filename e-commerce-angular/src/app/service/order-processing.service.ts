import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { OrderService } from './order.service';
import { CartService } from './cart.service';

import { Observable } from 'rxjs';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderProcessingService {

  constructor(
    private http: HttpClient,
    private orderService: OrderService,
    private cartService: CartService
  ) {}

  processPayAfterDeliveryOrder(order: Order): Observable<Order> {
    order.payment = {
      paymentMethod: 'Pay After Delivery',
      paymentStatus: 'Pending',
      paymentTime: new Date().toISOString(),
      amount: order.total
    };
    order.status = 'Pending';
    return this.placeOrder(order);
  }

  placeOrder(order: Order): Observable<Order> {
    return new Observable(observer => {
      this.orderService.placeOrder(order).subscribe({
        next: (placedOrder: Order) => {
          if (order.userId !== undefined) {
            this.cartService.clearCart(order.userId).subscribe({
            next: () => observer.next(placedOrder),
            error: err => observer.error(err)
          });}
        },
        error: err => observer.error(err)
      });
    });
  }
}
