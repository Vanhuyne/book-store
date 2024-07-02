import { Component, OnInit } from '@angular/core';
import { CartService } from '../../service/cart.service';
import { Router } from '@angular/router';
import { OrderService } from '../../service/order.service';
import { Cart } from '../../models/cart';
import { Order } from '../../models/order';
import { ICreateOrderRequest, IPayPalConfig, PayPalScriptService } from 'ngx-paypal';
import { Payment } from '../../models/payment';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit{
  userId : number = 0; 
  apiThumnailUrl = environment.apiUrl + '/products/uploads/';
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
    payment:{} as Payment
  };
  public payPalConfig?: IPayPalConfig;
  // paypalButtonDisabled: boolean = true;
  paymentMethod:string = 'payAfterDelivery';

  constructor(
    private cartService : CartService, 
    private router : Router , 
    private orderService :OrderService , 
    private authService : AuthService,
  ){
  } 

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
        this.initConfig();
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
      error: err => console.log(err)
    });
  }

  calculateOrderSummary() {
    if (this.cart) {
      this.order.subtotal = this.cart.cartItems.reduce(
        (total, item) => total + item.productPrice * item.quantity,
        0
      );
      this.order.tax = parseFloat((this.order.subtotal * 0.1).toFixed(2)); // Calculate tax and format to 2 decimal places
      this.order.total = parseFloat((this.order.subtotal + this.order.tax).toFixed(2)); 
      this.order.orderItems = this.cart.cartItems.map((item: any) => ({
        productName: item.productName,
        productThumbnailUrl: item.productThumbnailUrl,
        productPrice: item.productPrice,
        quantity: item.quantity
    }));
    }
  }
  
  private initConfig(): void {
    this.payPalConfig = {
      currency: 'USD', // Set your desired currency code
      clientId: 'sb', // Replace with your PayPal client ID
      createOrderOnClient: (data) => {
        const purchaseUnits = [
          {
            amount: {
              currency_code: 'USD',
              value: this.order.total.toFixed(2),
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: this.order.subtotal.toFixed(2),
                },
                tax_total: {
                  currency_code: 'USD',
                  value: this.order.tax.toFixed(2),
                },
              },
            },
            items: this.cart?.cartItems.map((item) => ({
              name: item.productName,
              quantity: item.quantity.toString(),
              category: 'DIGITAL_GOODS',
              unit_amount: {
                currency_code: 'USD',
                value: item.productPrice.toFixed(2),
              },
            })),
          },
        ];

        return {
          intent: 'CAPTURE',
          purchase_units: purchaseUnits,
        } as ICreateOrderRequest;
      },
      advanced: {
        commit: 'true',
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
      },
      onApprove: (data, actions) => {
        console.log(
          'onApprove - transaction was approved, but not authorized',
          data,
          actions
        );
        actions.order.get().then((details: any) => {
          console.log(
            'onApprove - you can get full order details inside onApprove: ',
            details
          );
        });
      },
      onClientAuthorization: (data) => {
        console.log(
          'onClientAuthorization - you should probably inform your server about completed transaction at this point',
          data
        );
        this.order.payment.paymentMethod = 'PayPal';
        this.order.payment.paymentStatus = data.status;
        this.order.payment.paymentTime = data.update_time;
        this.order.status = 'Completed';
        this.placeOrder();
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        // Handle cancel event
      },
      onError: (err) => {
        console.log('OnError', err);
        // Handle error event
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
        // Handle click event
      },
    };
  }

  onPaymentMethodChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.paymentMethod = target.value;
  }

  submitOrder() {
    if (this.paymentMethod === 'payAfterDelivery') {
      this.order.payment = {
        paymentMethod: 'Pay After Delivery',
        paymentStatus: 'Pending',
        paymentTime: new Date().toISOString(),
        amount: this.order.total
      };
      this.order.status = 'Pending';
      this.placeOrder();
    }
  }

  placeOrder() {
    this.orderService.placeOrder(this.order).subscribe({
      next: (order : Order) => {
        console.log('Order placed successfully', order);
          this.cartService.clearCart(this.userId).subscribe(() => {
            this.router.navigate(['/order-confirmation'], { state: { order: order } });
        });
      },
      error: err => console.error('Error placing order:', err)
    });
  }
  
}
