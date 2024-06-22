import { Component, OnInit } from '@angular/core';
import { Cart } from '../../shared/dto/cart';
import { CartService } from '../../service/cart.service';
import { environment } from '../../../environments/environment';
import { CartItem } from '../../shared/dto/cart-item';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{

  userId : number = 1; // get from local storage
  cart : Cart | undefined ;
  apiThumnailUrl = environment.apiUrl + '/products/uploads/';

  constructor(private cartService : CartService, private router : Router){}
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
    console.log(this.cart);
    
  }

  getTotal(cartItem : CartItem[]): number{
    return cartItem.reduce((total, item) => total + item.productPrice * item.quantity, 0);
  }

  getTax(cartItem : CartItem[]): number{
    return this.getTotal(cartItem) * 0.1; // Assume a 10% tax rate
  }

  getTotalWithTax(cartItems: CartItem[]): number {
    return this.getTotal(cartItems) + this.getTax(cartItems);
  }

  removeCartItem(userId: number, cartItemId: number): void {
    console.log('Removing cart item:', cartItemId);
    
    this.cartService.removeCartItem(userId, cartItemId).subscribe(
      () => {
        console.log('Cart item removed successfully');
        this.loadCart();
      },
      error => {
        console.error('Error removing cart item:', error);
        // Handle error as needed (e.g., show error message)
      }
    );
    }

    proceedToCheckout() {
      this.router.navigate(['/checkout']);
    }

    increaseQuantity(item: any) {
      // item.quantity++;
      // this.calculateOrderSummary();
    }

    decreaseQuantity(item: any) {
      // if (item.quantity > 1) {
      //   item.quantity--;
      //   this.calculateOrderSummary();
      // }
    }
}
