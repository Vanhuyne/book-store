import { Component, OnInit } from '@angular/core';
import { Order } from '../../models/order';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.css'
})
export class OrderConfirmationComponent implements OnInit {
  order: Order | undefined;
  constructor(private router : Router) { }

  ngOnInit(): void {
    this.order = history.state.order;
  }

  goToOrderDetails(): void {
    if (this.order) {
      this.router.navigate(['/order-detail'], { state: { order: this.order } });
    }
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }
}
