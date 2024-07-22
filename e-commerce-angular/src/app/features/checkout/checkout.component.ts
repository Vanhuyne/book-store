import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { StripeCardComponent, StripeService } from 'ngx-stripe';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';

import { Cart } from '../../models/cart';
import { Order } from '../../models/order';
import { Payment } from '../../models/payment';
import { CartService } from '../../service/cart.service';
import { OrderService } from '../../service/order.service';
import { AuthService } from '../../service/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  @ViewChild('checkoutForm') checkoutForm!: NgForm;
  @ViewChild(StripeCardComponent) card!: StripeCardComponent;
  baseUrl = environment.apiUrl;

  userId: number = 0;
  cart: Cart | undefined;
  order: Order = {
    userId: this.userId,
    shippingName: '',
    shippingAddress: '',
    shippingCity: '',
    shippingPostalCode: '',
    subtotal: 0,
    tax: 0,
    total: 0,
    status: 'Pending',
    orderItems: [],
    payment: {} as Payment
  };
  paymentMethod: string = 'payAfterDelivery';
  formSubmitted: boolean = false;
  isProcessing: boolean = false;

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  constructor(
    private cartService: CartService,
    private router: Router,
    private orderService: OrderService,
    private authService: AuthService,
    private stripeService: StripeService,
    private http : HttpClient,
    private toast : ToastrService
  ) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.userId = user.userId;
        this.order.userId = this.userId;
        this.loadCart();
      } else {
        console.error('User not found');
        this.router.navigate(['/login']);
      }
    });
  }

  loadCart() {
    this.cartService.getCart(this.userId).subscribe({
      next: cart => {
        this.cart = cart;
        this.calculateOrderSummary();
      },
      error: err => console.error('Error loading cart:', err)
    });
  }

  calculateOrderSummary() {
    if (this.cart) {
      this.order.subtotal = this.cart.cartItems.reduce(
        (total, item) => parseFloat((total + item.productPrice * item.quantity).toFixed(2)),
        0
      );
      this.order.tax = parseFloat((this.order.subtotal * 0.1).toFixed(2));
      this.order.total = parseFloat((this.order.subtotal + this.order.tax).toFixed(2));
      this.order.orderItems = this.cart.cartItems.map(item => ({
        productName: item.productName,
        productThumbnailUrl: item.productThumbnailUrl,
        productPrice: item.productPrice,
        quantity: item.quantity
      }));
    }
  }

  onPaymentMethodChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.paymentMethod = target.value;
  }

  submitOrder() {
    this.formSubmitted = true;
    
    if (this.checkoutForm.invalid) {
      return;
    }

    this.isProcessing = true;

    if (this.paymentMethod === 'payAfterDelivery') {
      this.processPayAfterDeliveryOrder();
    } else if (this.paymentMethod === 'stripe') {
      this.processStripeOrder();
    }
  }

  processPayAfterDeliveryOrder() {
    this.order.payment = {
      paymentMethod: 'Pay After Delivery',
      paymentStatus: 'Pending',
      paymentTime: new Date().toISOString(),
      amount: this.order.total
    };
    this.order.status = 'Pending';
    this.placeOrder();
  }

  processStripeOrder() {
    this.stripeService.createToken(this.card.element).subscribe({
      next: result => {
        if (result.token) {
          // Send the token to your server
          this.http.post(`${this.baseUrl}/orders/process-payment`, {
            token: result.token.id,
            amount: this.order.total * 100, // amount in cents
            currency: 'usd'
          }).subscribe({
            next: (response: any) => {
              if (response.status === 'succeeded') {
                this.order.payment = {
                  paymentMethod: 'Stripe',
                  paymentStatus: 'Completed',
                  paymentTime: new Date().toISOString(),
                  amount: this.order.total
                };
                this.order.status = 'Processing';
                this.placeOrder();
              } else {
                this.toast.error('Payment failed');
                console.error('Payment failed:', response);
                this.isProcessing = false;
                // Handle payment failure (e.g., show error message to user)
              }
            },
            error: err => {
              
              this.toast.error('Error processing payment');
              this.isProcessing = false;
              // Handle error (e.g., display to user)
            }
          });
        } else if (result.error) {
          console.error('Stripe error:', result.error.message);
          this.isProcessing = false;
         
        }
      },
      error: err => {
        console.error('Error creating Stripe token:', err);
        this.isProcessing = false;
        
      }
    });
  }

  placeOrder() {
    this.orderService.placeOrder(this.order).subscribe({
      next: (order: Order) => {
        console.log('Order placed successfully', order);
        this.cartService.clearCart(this.userId).subscribe({
          next: () => {
            this.isProcessing = false;
            this.router.navigate(['/order-confirmation'], { state: { order: order } });
          },
          error: err => {
            console.error('Error clearing cart:', err);
            this.isProcessing = false;
            // Handle error (e.g., display to user)
          }
        });
      },
      error: err => {
        console.error('Error placing order:', err);
        this.isProcessing = false;
        // Handle error (e.g., display to user)
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.checkoutForm?.form.get(fieldName);
    return (field?.invalid && (field.dirty || field.touched)) || (this.formSubmitted && field?.invalid) || false;
  }
}