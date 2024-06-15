import { Photo } from "./photo";


export interface Product {
    productId: number;
    name : string;
    description: string;
    price: number;
    stockQuantity: number;
    thumbnailUrl: string;
    categoryId: number;
    createdAt: string; // LocalDateTime will be a string in JSON
    updatedAt: string;
    photoUrls: Photo[];
}