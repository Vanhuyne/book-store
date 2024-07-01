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


  constructor(private http : HttpClient) { 
  }

  getAllProducts(page : number , size : number, category? : string): Observable<Page<Product>>{
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
      if(category){
        params = params.set('category', category);
      }
      return this.http.get<Page<Product>>(this.apiUrl, { params });
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoryUrl);
  }

  searchProducts(keyword: string ,page: number, size: number): Observable<Page<Product>> {
    let params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<Product>>(`${this.apiUrl}/search`, { params });
  }


}
