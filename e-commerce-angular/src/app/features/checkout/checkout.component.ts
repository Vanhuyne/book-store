import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
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
import { OrderProcessingService } from '../../service/order-processing.service';
import { PaymentService } from '../../service/payment.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  @ViewChild(StripeCardComponent) card!: StripeCardComponent;
  
  checkoutForm!: FormGroup;
  userId: number = 0;
  cart: Cart | undefined;
  order!: Order;
  paymentMethod: string = 'payAfterDelivery';
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
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private cartService: CartService,
    private orderProcessingService: OrderProcessingService,
    private paymentService: PaymentService,
    private toast: ToastrService
  ) {
    this.initializeForm();
    this.initializeOrder();
  }

  ngOnInit(): void {
    this.checkUserAuthentication();
    this.setupFormValueChanges();
  }

  private initializeForm(): void {
    this.checkoutForm = this.formBuilder.group({
      shippingName: ['', Validators.required],
      shippingAddress: ['', Validators.required],
      shippingCity: ['', Validators.required],
      shippingPostalCode: ['', Validators.required],
      paymentMethod: ['payAfterDelivery', Validators.required]
    });
  }

  private initializeOrder(): void {
    this.order = {
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
  }

  private checkUserAuthentication(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.authService.getUser().subscribe({
      next: user => {
        if (user) {
          this.userId = user.userId;
          this.order.userId = this.userId;
          this.loadCart();
        } else {
          this.router.navigate(['/login']);
        }
      },
      error: err => {
        console.error('Error fetching user:', err);
        this.router.navigate(['/login']);
      }
    });
  }

  private setupFormValueChanges(): void {
    this.checkoutForm.get('paymentMethod')?.valueChanges.subscribe(value => {
      this.paymentMethod = value;
    });
  }

  loadCart(): void {
    this.cartService.getCart(this.userId).subscribe({
      next: cart => {
        this.cart = cart;
        this.calculateOrderSummary();
      },
      error: err => console.error('Error loading cart:', err)
    });
  }

  calculateOrderSummary(): void {
    if (this.cart) {
      this.order.subtotal = this.calculateSubtotal();
      this.order.tax = this.calculateTax();
      this.order.total = this.calculateTotal();
      this.order.orderItems = this.mapCartItemsToOrderItems();
    }
  }

  private calculateSubtotal(): number {
    return this.cart!.cartItems.reduce(
      (total, item) => parseFloat((total + item.productPrice * item.quantity).toFixed(2)),
      0
    );
  }

  private calculateTax(): number {
    return parseFloat((this.order.subtotal * 0.1).toFixed(2));
  }

  private calculateTotal(): number {
    return parseFloat((this.order.subtotal + this.order.tax).toFixed(2));
  }

  private mapCartItemsToOrderItems(): any[] {
    return this.cart!.cartItems.map(item => ({
      productName: item.productName,
      productThumbnailUrl: item.productThumbnailUrl,
      productPrice: item.productPrice,
      quantity: item.quantity
    }));
  }

  submitOrder(): void {
    if (this.checkoutForm.invalid) {
      this.markFormFieldsAsTouched();
      return;
    }

    this.isProcessing = true;
    this.updateOrderWithFormValues();

    if (this.paymentMethod === 'payAfterDelivery') {
      this.processPayAfterDeliveryOrder();
    } else if (this.paymentMethod === 'stripe') {
      this.processStripeOrder();
    }
  }

  private markFormFieldsAsTouched(): void {
    Object.keys(this.checkoutForm.controls).forEach(key => {
      const control = this.checkoutForm.get(key);
      if (control?.invalid) {
        control.markAsTouched();
      }
    });
  }

  private updateOrderWithFormValues(): void {
    const formValue = this.checkoutForm.value;
    this.order.shippingName = formValue.shippingName;
    this.order.shippingAddress = formValue.shippingAddress;
    this.order.shippingCity = formValue.shippingCity;
    this.order.shippingPostalCode = formValue.shippingPostalCode;
  }

  private processPayAfterDeliveryOrder(): void {
    this.orderProcessingService.processPayAfterDeliveryOrder(this.order).subscribe({
      next: (order: Order) => this.handleOrderSuccess(order),
      error: (err) => this.handleOrderError(err)
    });
  }

  private processStripeOrder(): void {
    const amountInCents = Math.round(this.order.total * 100);
    
    this.paymentService.createPaymentIntent(amountInCents).subscribe({
      next: (paymentIntent: any) => this.handlePaymentIntent(paymentIntent),
      error: (err) => this.handlePaymentError(err)
    });
  }

  private handlePaymentIntent(paymentIntent: any): void {
    this.paymentService.confirmCardPayment(paymentIntent.client_secret, {
      card: this.card.element,
      billing_details: this.getBillingDetails()
    }).subscribe({
      next: (result) => this.handlePaymentResult(result),
      error: (err) => this.handlePaymentError(err)
    });
  }

  private getBillingDetails(): any {
    return {
      name: this.order.shippingName,
      address: {
        line1: this.order.shippingAddress,
        city: this.order.shippingCity,
        postal_code: this.order.shippingPostalCode
      }
    };
  }

  private handlePaymentResult(result: any): void {
    if (result.error) {
      this.toast.error(`Payment failed: ${result.error.message}`);
      this.isProcessing = false;
    } else if (result.paymentIntent.status === 'succeeded') {
      this.order.payment = {
        paymentMethod: 'Stripe',
        paymentStatus: 'Completed',
        paymentTime: new Date().toISOString(),
        amount: this.order.total
      };
      this.order.status = 'Processing';
      this.placeOrder();
    }
  }

  private placeOrder(): void {
    this.orderProcessingService.placeOrder(this.order).subscribe({
      next: (order: Order) => this.handleOrderSuccess(order),
      error: (err) => this.handleOrderError(err)
    });
  }

  private handleOrderSuccess(order: Order): void {
    console.log('Order placed successfully', order);
    this.isProcessing = false;
    this.router.navigate(['/order-confirmation'], { state: { order: order } });
  }

  private handleOrderError(err: any): void {
    console.error('Error placing order:', err);
    this.toast.error('Error placing order. Please try again.');
    this.isProcessing = false;
  }

  private handlePaymentError(err: any): void {
    this.toast.error('Error processing payment');
    this.isProcessing = false;
    console.error('Error:', err);
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.checkoutForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}