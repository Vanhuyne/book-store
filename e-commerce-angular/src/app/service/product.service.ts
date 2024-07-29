import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Page } from '../models/page';
import { Product } from '../models/product';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = environment.apiUrl + '/products';
  private categoryUrl  = environment.apiUrl + '/categories';
  private productsSubject = new Subject<Page<Product>>();
  public products$ = this.productsSubject.asObservable();

  constructor(private http : HttpClient) { 
  }

  getAllProducts(page: number, size: number, category?: string): Observable<Page<Product>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    if (category) {
      params = params.set('category', category);
    }
    const request = this.http.get<Page<Product>>(this.apiUrl, { params });
    request.subscribe(products => this.productsSubject.next(products));
    return request;
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoryUrl);
  }

  searchProducts(keyword: string, page: number, size: number): Observable<Page<Product>> {
    let params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page.toString())
      .set('size', size.toString());

    const request = this.http.get<Page<Product>>(`${this.apiUrl}/search`, { params });
    request.subscribe(products => this.productsSubject.next(products));
    return request;
  }

  getProductById(productId: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${productId}`);
  }

  filterProducts(minPrice: number, maxPrice: number, minStockQuantity: number, page: number, size: number):Observable<Page<Product>> {
    let params = new HttpParams()
      .set('minPrice', minPrice.toString())
      .set('maxPrice', maxPrice.toString())
      .set('minStockQuantity', minStockQuantity.toString())
      .set('page', page.toString())
      .set('size', size.toString());

    const request = this.http.get<Page<Product>>(`${this.apiUrl}/filter`, { params });
    request.subscribe(products => this.productsSubject.next(products));
    return request;
  }

  createProduct(product: Product , file: File): Observable<String> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('product', JSON.stringify(product));
    
    return this.http.post<String>(`${this.apiUrl}/create`, formData);
  }

  updateProduct(productId: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${productId}`, product);
  }

  deleteProduct(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${productId}`);
  }

}
