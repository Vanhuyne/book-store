import { Component } from '@angular/core';
import { Order } from '../../models/order';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../../service/order.service';
import { OrderItem } from '../../models/order-item';
import { Payment } from '../../models/payment';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.component.html',
  styleUrl: './order-management.component.css'
})
export class OrderManagementComponent {

  orders : Order[] = [];
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 5;
  loading: boolean = false;
  error: string | null = null;
  apiThumnailUrl = environment.apiUrl + '/products/uploads/';

  selectedOrderItems: OrderItem[] | null = null;
  selectedPayment: Payment | null = null;
  editingOrder: Order | null = null;
  editOrderForm!: FormGroup;

  constructor(
    private orderService: OrderService,
    private fb: FormBuilder
  ) {
    this.editOrderForm = this.fb.group({
      shippingName: ['', Validators.required],
      status: ['', Validators.required],
      total: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadOrders(this.currentPage, this.pageSize);
  }

  loadOrders(page: number, size: number) {
    this.loading = true;
    this.error = null;
    this.orderService.getOrders(page, size).subscribe({
      next: (response) => {
        this.orders = response.content;
        this.totalPages = response.totalPages;
        this.currentPage = page;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  onPageChange(page: number) {
    this.loadOrders(page, this.pageSize);
  }

  showOrderItems(orderItems: OrderItem[]) {
    this.selectedOrderItems = orderItems;
  }

  closeOrderItemsModal() {
    this.selectedOrderItems = null;
  }

  showPaymentDetails(payment: Payment) {
    this.selectedPayment = payment;
  }

  closePaymentModal() {
    this.selectedPayment = null;
  }

  deleteOrder(order : Order) {
    if (order.orderId !== undefined) {
      this.orderService.deleteOrder(order.orderId).subscribe({
        next: (response) => {
          this.loadOrders(this.currentPage, this.pageSize); // Reload orders
        },
        error: (err) => {
          this.error = err.message;
        }
      });
    }
  }

    editOrder(order: Order) {
      this.editingOrder = { ...order };
      this.editOrderForm.patchValue({
        shippingName: this.editingOrder.shippingName,
        status: this.editingOrder.status,
        total: this.editingOrder.total
      });
    }
    closeEditOrderModal() {
      this.editingOrder = null;
      this.editOrderForm.reset();
    }
    saveOrderChanges() {
      if (this.editOrderForm.valid && this.editingOrder) {
        const updatedOrder = { ...this.editingOrder, ...this.editOrderForm.value };
        this.orderService.updateOrder(updatedOrder).subscribe({
          next: (response) => {
            this.loadOrders(this.currentPage, this.pageSize); // Reload orders
            this.closeEditOrderModal(); // Close modal
          },
          error: (err) => {
            this.error = err.message;
          }
        });
      }
    }
}
