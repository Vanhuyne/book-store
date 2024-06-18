export interface Payment {
    paymentId: string;        // PayPal payment ID
    payerId?: string;          // PayPal payer ID
    paymentStatus: string;    // Payment status (e.g., "Completed")
    paymentTime: string;      // Time when the payment was made
}
