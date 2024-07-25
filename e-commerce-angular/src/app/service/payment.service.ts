import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { StripeService } from 'ngx-stripe';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private stripeService: StripeService
  ) {}

  createPaymentIntent(amount: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/orders/create-payment-intent`, {
      amount: amount,
      currency: 'usd'
    });
  }

  confirmCardPayment(clientSecret: string, paymentMethod: any): Observable<any> {
    return this.stripeService.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod,
      setup_future_usage: 'off_session'
    });
  }

  getPaymentMethodsCount(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/payments/payment-methods`);
  }
}
