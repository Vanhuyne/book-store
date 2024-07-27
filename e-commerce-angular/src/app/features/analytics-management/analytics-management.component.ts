import { Component, OnInit, ViewChild } from '@angular/core';
import { PaymentService } from '../../service/payment.service';
import { UserService } from '../../service/user.service';
import { OrderService } from '../../service/order.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartOptions, ChartType } from 'chart.js';
import { ChartEvent } from 'chart.js/dist/core/core.plugins';



@Component({
  selector: 'app-analytics-management',
  templateUrl: './analytics-management.component.html',
  styleUrl: './analytics-management.component.css'
})
export class AnalyticsManagementComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  paymentMethodsCount: any[] = [];
  totalOrders!: number;
  totalRevenue!: number;
  totalUserCount!: number;

  private colors: string[] = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#E7E9ED'
  ];

  constructor(
    private paymentService: PaymentService,
    private userService : UserService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadOrdersCountForLast30Days();
    this.loadPaymentMethodsCount();
    this.loadTotalOrders();
    this.loadTotalRevenue();
    this.loadTotalUserCount();
  }

  // Pie chart for payment methods
  public paymentMethodsChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      }
    }
  };
  public paymentMethodsChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [] ,
      backgroundColor: this.colors
    }]
  };
  public paymentMethodsChartType: ChartType = 'pie';

  loadPaymentMethodsCount(): void {
    this.paymentService.getPaymentMethodsCount().subscribe((data) => {
      this.paymentMethodsCount = data;
      this.updatePaymentMethodsChart(data);
    });
  }
  updatePaymentMethodsChart(data: any[]): void {
    this.paymentMethodsChartData.labels = data.map(item => item[0]);
    this.paymentMethodsChartData.datasets[0].data = data.map(item => item[1]);
    this.paymentMethodsChartData.datasets[0].backgroundColor = this.colors.slice(0, data.length); // Ensure the number of colors matches the number of data points
    this.chart?.update();
  }

  loadTotalUserCount(): void {
    this.userService.getTotalUserCount().subscribe(data => {
      this.totalUserCount = data;
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
  
  // Line Chart Configuration
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Number of Orders'
        },
        min: 0
      }
    },
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    elements: {
      line: {
        tension: 0.2 // Slightly curved lines
      }
    }
  };
  public lineChartType: ChartType = 'line';

  public lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      { 
        data: [], 
        label: 'Daily Orders',
        borderColor: 'rgba(0, 123, 255, 1)',
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        fill: true
      }
    ]
  };
  
  loadOrdersCountForLast30Days(): void {
    this.orderService.getOrdersSince().subscribe(
      (data: any[]) => {
        this.lineChartData.labels = data.map(item => item.date);
        this.lineChartData.datasets[0].data = data.map(item => item.count);
        this.chart?.update();
      },
      (error) => console.error('Error loading orders:', error)
    );
  }
  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }
}
