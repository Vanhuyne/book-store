import { Component, OnInit } from '@angular/core';
import { Cart } from '../../shared/dto/cart';
import { CartService } from '../../service/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{
  cart : Cart | undefined ;

  constructor(private cartService : CartService){}
  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(){
    const userId = 1; // get from local storage
    this.cartService.getCart(userId).subscribe(
      {
      next: cart => this.cart = cart,
      error: err => console.log(err)
      }
    );
  }

}
