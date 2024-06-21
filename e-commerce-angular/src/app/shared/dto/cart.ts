import { CartItem } from "./cart-item";

export interface Cart {
    cartId: number;
    userId: number;
    processed: boolean;
    cartItems: CartItem[];
}
