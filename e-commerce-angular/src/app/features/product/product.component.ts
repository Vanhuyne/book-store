import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../models/product';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  apiThumnailUrl = environment.apiUrl + '/products/uploads/';
  @Input() product!: Product ;
  @Output() addToCartClicked: EventEmitter<number> = new EventEmitter<number>();

  constructor() {}

  addToCart(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.addToCartClicked.emit(this.product.productId);
  }
}
