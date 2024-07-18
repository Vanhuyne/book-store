import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../service/order.service';
import { Order } from '../../models/order';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css'
})
export class OrderDetailComponent {

  order: Order | undefined;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {

  }

  ngOnInit(): void {
    const order = history.state.order;
    if (order) {
      this.order = order;
    } else {
      // If order is not in history state, you might want to fetch it from a service
      // This depends on how you're managing orders in your application
      console.error('Order not found in history state');
      
      this.router.navigate(['/']);
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  generateOrderNumber(): string {
    // Generate a random 6-digit number
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString();
  }
}
