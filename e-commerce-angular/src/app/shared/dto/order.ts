import { Payment } from "./payment";

export interface Order {
    userId?: number;
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
