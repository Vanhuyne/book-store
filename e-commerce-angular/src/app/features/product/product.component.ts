import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../shared/dto/product';
import { environment } from '../../../environments/environment';
import { CartService } from '../../service/cart.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  apiThumnailUrl = environment.apiUrl + '/products/uploads/';
  @Input() product!: Product ;
  @Output() addToCartClicked: EventEmitter<number> = new EventEmitter<number>();

  constructor(private cartService: CartService) {}

  addToCart() {
      this.addToCartClicked.emit(this.product.productId);
  }
}
