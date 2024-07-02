import { Component, OnInit } from '@angular/core';
import { Cart } from '../../models/cart';
import { CartService } from '../../service/cart.service';
import { environment } from '../../../environments/environment';
import { CartItem } from '../../models/cart-item';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{

  userId : number = 0; 
  cart : Cart | undefined ;
  apiThumnailUrl = environment.apiUrl + '/products/uploads/';
  loadingCart: boolean = false;

  constructor(
    private cartService : CartService, 
    private router : Router,
    private authService : AuthService){}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.userId = user.userId;
        this.loadCart();
      } else {
        console.error('User not found');
        this.router.navigate(['/login']);
      }
    });
    
  }
  loadCart(){
    this.loadingCart = true;
    this.cartService.getCart(this.userId).subscribe({
      next: cart => {
        this.cart = cart;
        console.log('Cart loaded: ', this.cart); 
      },
      error: err => console.log(err),
      complete: () => {
        this.loadingCart = false; 
      }
    });
  }

  getTotal(cartItem: CartItem[]): number {
    return parseFloat(cartItem.reduce((total, item) => total + item.productPrice * item.quantity, 0).toFixed(2));
  }

  getTax(cartItem: CartItem[]): number {
    return parseFloat((this.getTotal(cartItem) * 0.1).toFixed(2)); // Assume a 10% tax rate
  }

  getTotalWithTax(cartItems: CartItem[]): number {
    return parseFloat((this.getTotal(cartItems) + this.getTax(cartItems)).toFixed(2));
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
 
  increaseQuantity(cartItem: CartItem): void {
    this.cartService.increaseQuantity(this.userId, cartItem.cartItemId).subscribe(
      (updatedCartItem) => {
        if (updatedCartItem) {
          console.log('Quantity increased successfully:', updatedCartItem);
          // Update local cart with the updated cart item
          if (this.cart) {
            const index = this.cart.cartItems.findIndex(item => item.cartItemId === updatedCartItem.cartItemId);
            if (index !== -1) {
              this.cart.cartItems[index] = updatedCartItem;
            }
          }
        } else {
          console.error('Error: Received null or undefined cart item.');
          // Handle error scenario, such as displaying an error message
        }
      },
      error => {
        console.error('Error increasing quantity:', error.error);
        // Handle error as needed
      }
    );
  }

  decreaseQuantity(cartItem: CartItem): void {
    this.cartService.decreaseQuantity(this.userId, cartItem.cartItemId).subscribe(
      (updatedCartItem) => {
        if (updatedCartItem) {
          console.log('Quantity increased successfully:', updatedCartItem);
          // Update local cart with the updated cart item
          if (this.cart) {
            const index = this.cart.cartItems.findIndex(item => item.cartItemId === updatedCartItem.cartItemId);
            if (index !== -1) {
              this.cart.cartItems[index] = updatedCartItem;
            }
          }
        } else {
          console.log('Cart item quantity is now zero and it has been removed.');
          // Remove the cart item 
          if (this.cart) {
            this.cart.cartItems = this.cart.cartItems.filter(item => item.cartItemId !== cartItem.cartItemId);
          }
        }
      },
      error => {
        console.error('Error decrease quantity:', error);
        // Handle error as needed
      }
    );
  }

}
