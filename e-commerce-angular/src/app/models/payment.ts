export interface Payment {
    paymentId?: string;        // PayPal payment ID
    paymentMethod?: string;              // PayPal payer ID
    paymentStatus: string;    // Payment status (e.g., "Completed")
    paymentTime?: string;      // Time when the payment was made
    amount?: number;          // Payment amount
}
