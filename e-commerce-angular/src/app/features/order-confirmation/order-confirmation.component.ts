import { Component, OnInit } from '@angular/core';
import { Order } from '../../shared/dto/order';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.css'
})
export class OrderConfirmationComponent implements OnInit {
  order: Order | undefined;
  constructor(private route : ActivatedRoute) { }

  ngOnInit(): void {
    // Retrieve order details from navigation state
    this.order = history.state.order;
    console.log('Order confirmation details:', this.order);
  }
}
