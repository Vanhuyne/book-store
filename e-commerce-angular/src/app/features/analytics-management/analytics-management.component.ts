import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../service/payment.service';
import { UserService } from '../../service/user.service';
import { OrderService } from '../../service/order.service';

@Component({
  selector: 'app-analytics-management',
  templateUrl: './analytics-management.component.html',
  styleUrl: './analytics-management.component.css'
})
export class AnalyticsManagementComponent implements OnInit {
  paymentMethodsCount: any[] = [];
  totalOrders!: number;
  totalRevenue!: number;
  monthlyOrders: number[] = [];
  totalUserCount!: number;

  monthlyOrdersChartData: any[] = [];
  paymentMethodsChartData: any[] = [];

  constructor(
    private paymentService: PaymentService,
    private userService : UserService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadPaymentMethodsCount();
    this.loadTotalOrders();
    this.loadTotalRevenue();
    this.loadMonthlyOrders();
    this.loadTotalUserCount();
    
  }

  loadPaymentMethodsCount(): void {
    this.paymentService.getPaymentMethodsCount().subscribe((data) => {
      this.paymentMethodsCount = data;
      this.paymentMethodsChartData = this.formatPaymentMethodsData(data);
    });
  }
  loadTotalUserCount(): void {
    this.userService.getTotalUserCount().subscribe(data => {
      this.totalUserCount = data;
    });
  }

  loadMonthlyOrders(): void {
    this.orderService.getMonthlyOrders().subscribe(data => {
      this.monthlyOrders = data;
      this.monthlyOrdersChartData = this.formatMonthlyOrdersData(data);
    });
  }

  loadTotalRevenue(): void {
    this.orderService.getTotalRevenue().subscribe(data => {
      this.totalRevenue = data;
    });
  }

  loadTotalOrders(): void {
    this.orderService.getTotalOrders().subscribe(data => {
      this.totalOrders = data;
    });
  }

  formatPaymentMethodsData(data: any[]): any[] {
    return data.map(item => ({
      name: item[0],
      value: item[1]
    }));
  }
  formatMonthlyOrdersData(data: number[]): any[] {
    return data.map((value, index) => ({
      name: `Month ${index + 1}`,
      value: value
    }));
  }
}
