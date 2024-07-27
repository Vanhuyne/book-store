import { OrderItem } from "./order-item";
import { Payment } from "./payment";

export interface Order {
    orderId?: number;
    userId?: number;
    orderItems: OrderItem[];
    shippingName: string;
    shippingAddress: string;
    shippingCity: string;
    shippingPostalCode: string;
    subtotal: number;
    tax: number;
    total: number;
    status: string;
    payment: Payment;
}
